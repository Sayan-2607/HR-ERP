const prisma = require("../config/database");

exports.apply = async (req, res, next) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const totalDays = Math.ceil((to - from) / 86400000) + 1;

    // Check balance
    const balance = await prisma.leaveBalance.findFirst({
      where: { employeeId: req.employeeId, leaveType, year: new Date().getFullYear() },
    });

    if (balance && balance.remaining < totalDays) {
      return res.status(400).json({ error: `Insufficient ${leaveType} balance. Available: ${balance.remaining}` });
    }

    const leave = await prisma.leaveRequest.create({
      data: { employeeId: req.employeeId, leaveType, fromDate: from, toDate: to, totalDays, reason },
    });

    res.status(201).json(leave);
  } catch (err) { next(err); }
};

exports.getMyLeaves = async (req, res, next) => {
  try {
    const [requests, balances] = await Promise.all([
      prisma.leaveRequest.findMany({
        where: { employeeId: req.employeeId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.leaveBalance.findMany({
        where: { employeeId: req.employeeId, year: new Date().getFullYear() },
      }),
    ]);
    res.json({ requests, balances });
  } catch (err) { next(err); }
};

exports.getPending = async (req, res, next) => {
  try {
    const requests = await prisma.leaveRequest.findMany({
      where: { status: "PENDING" },
      include: { employee: { select: { firstName: true, lastName: true, department: true, avatar: true, designation: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(requests);
  } catch (err) { next(err); }
};

exports.approve = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    const leave = await prisma.leaveRequest.update({
      where: { id },
      data: { status: "APPROVED", approvedBy: req.user.id, approvedAt: new Date(), comments },
    });

    // Deduct balance
    await prisma.leaveBalance.updateMany({
      where: { employeeId: leave.employeeId, leaveType: leave.leaveType, year: new Date().getFullYear() },
      data: { used: { increment: leave.totalDays }, remaining: { decrement: leave.totalDays } },
    });

    res.json(leave);
  } catch (err) { next(err); }
};

exports.reject = async (req, res, next) => {
  try {
    const leave = await prisma.leaveRequest.update({
      where: { id: req.params.id },
      data: { status: "REJECTED", approvedBy: req.user.id, approvedAt: new Date(), comments: req.body.comments },
    });
    res.json(leave);
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const [pending, approved, rejected, onLeaveToday] = await Promise.all([
      prisma.leaveRequest.count({ where: { status: "PENDING" } }),
      prisma.leaveRequest.count({ where: { status: "APPROVED", fromDate: { gte: new Date(year, 0, 1) } } }),
      prisma.leaveRequest.count({ where: { status: "REJECTED", fromDate: { gte: new Date(year, 0, 1) } } }),
      prisma.leaveRequest.count({
        where: { status: "APPROVED", fromDate: { lte: new Date() }, toDate: { gte: new Date() } },
      }),
    ]);
    res.json({ pending, approved, rejected, onLeaveToday });
  } catch (err) { next(err); }
};
