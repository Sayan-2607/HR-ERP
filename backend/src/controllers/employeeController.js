const prisma = require("../config/database");
const redis = require("../config/redis");

exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, department, status, sortBy = "firstName", sortOrder = "asc" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { employeeId: { contains: search, mode: "insensitive" } },
        { designation: { contains: search, mode: "insensitive" } },
      ];
    }
    if (department) where.department = department;
    if (status) where.status = status;

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true, employeeId: true, firstName: true, lastName: true,
          email: true, phone: true, avatar: true, designation: true,
          department: true, team: true, status: true, joiningDate: true,
          employmentType: true, skills: true, attritionRisk: true,
        },
      }),
      prisma.employee.count({ where }),
    ]);

    res.json({
      data: employees,
      pagination: {
        page: parseInt(page), limit: parseInt(limit),
        total, totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: req.params.id },
      include: {
        leaveBalances: { where: { year: new Date().getFullYear() } },
        performances: { orderBy: { year: "desc" }, take: 3 },
        goals: { where: { status: { not: "COMPLETED" } } },
        enrollments: { include: { course: true }, take: 5 },
        moodCheckins: { orderBy: { date: "desc" }, take: 30 },
      },
    });

    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = req.body;
    const empId = `WS-${Date.now().toString(36).toUpperCase()}`;

    const employee = await prisma.employee.create({
      data: {
        ...data,
        employeeId: empId,
        joiningDate: new Date(data.joiningDate || Date.now()),
        user: {
          create: {
            email: data.email.toLowerCase(),
            password: await require("bcryptjs").hash(data.password || "Welcome@123", 12),
            role: data.role || "EMPLOYEE",
          },
        },
      },
    });

    res.status(201).json(employee);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const employee = await prisma.employee.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(employee);
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    await prisma.employee.update({
      where: { id: req.params.id },
      data: { status: "TERMINATED", exitDate: new Date() },
    });
    res.json({ message: "Employee deactivated" });
  } catch (err) { next(err); }
};

exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await prisma.employee.groupBy({
      by: ["department"],
      _count: true,
      where: { status: "ACTIVE" },
    });
    res.json(departments.map((d) => ({ name: d.department, count: d._count })));
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const cacheKey = "employee:stats";
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const [total, active, onLeave, newThisMonth, byDepartment, byGender, avgTenure] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { status: "ACTIVE" } }),
      prisma.employee.count({ where: { status: "ON_LEAVE" } }),
      prisma.employee.count({
        where: { joiningDate: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
      }),
      prisma.employee.groupBy({ by: ["department"], _count: true, where: { status: "ACTIVE" } }),
      prisma.employee.groupBy({ by: ["gender"], _count: true, where: { status: "ACTIVE" } }),
      prisma.employee.aggregate({ _avg: { attritionRisk: true } }),
    ]);

    const stats = {
      total, active, onLeave, newThisMonth,
      departments: byDepartment.map((d) => ({ name: d.department, count: d._count })),
      genderDistribution: byGender.map((g) => ({ gender: g.gender, count: g._count })),
      avgAttritionRisk: avgTenure._avg.attritionRisk || 0,
    };

    await redis.setex(cacheKey, 300, JSON.stringify(stats));
    res.json(stats);
  } catch (err) { next(err); }
};
