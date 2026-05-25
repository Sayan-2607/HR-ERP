const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const prisma = require("../config/database");

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
  const refreshToken = jwt.sign({ userId, type: "refresh" }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  });
  return { accessToken, refreshToken };
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { employee: true },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Account is deactivated" });
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        employee: user.employee
          ? {
              id: user.employee.id,
              employeeId: user.employee.employeeId,
              firstName: user.employee.firstName,
              lastName: user.employee.lastName,
              designation: user.employee.designation,
              department: user.employee.department,
              avatar: user.employee.avatar,
            }
          : null,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, designation, department, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const empId = `WS-${Date.now().toString(36).toUpperCase()}`;

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || "EMPLOYEE",
        employee: {
          create: {
            employeeId: empId,
            firstName,
            lastName,
            email: email.toLowerCase(),
            designation: designation || "New Employee",
            department: department || "General",
            joiningDate: new Date(),
          },
        },
      },
      include: { employee: true },
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        employee: {
          id: user.employee.id,
          employeeId: user.employee.employeeId,
          firstName: user.employee.firstName,
          lastName: user.employee.lastName,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: "Refresh token required" });

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) return res.status(401).json({ error: "User not found" });

    // Rotate refresh token
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    const tokens = generateTokens(user.id, user.role);

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    res.json(tokens);
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res) => {
  const user = req.user;
  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    employee: user.employee
      ? {
          id: user.employee.id,
          employeeId: user.employee.employeeId,
          firstName: user.employee.firstName,
          lastName: user.employee.lastName,
          designation: user.employee.designation,
          department: user.employee.department,
          avatar: user.employee.avatar,
          skills: user.employee.skills,
        }
      : null,
  });
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};
