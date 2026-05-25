const prisma = require("../config/database");

exports.clockIn = async (req, res, next) => {
  try {
    const employeeId = req.employeeId;
    const { method, location, latitude, longitude } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await prisma.attendance.findUnique({
      where: { employeeId_date: { employeeId, date: today } },
    });

    if (existing?.clockIn) {
      return res.status(400).json({ error: "Already clocked in today" });
    }

    const now = new Date();
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15);

    const attendance = await prisma.attendance.upsert({
      where: { employeeId_date: { employeeId, date: today } },
      update: { clockIn: now, method: method || "WEB", location, latitude, longitude, isLateArrival: isLate, status: "PRESENT" },
      create: { employeeId, date: today, clockIn: now, method: method || "WEB", location, latitude, longitude, isLateArrival: isLate, status: "PRESENT" },
    });

    res.json(attendance);
  } catch (err) { next(err); }
};

exports.clockOut = async (req, res, next) => {
  try {
    const employeeId = req.employeeId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findUnique({
      where: { employeeId_date: { employeeId, date: today } },
    });

    if (!attendance?.clockIn) return res.status(400).json({ error: "No clock-in record found" });
    if (attendance.clockOut) return res.status(400).json({ error: "Already clocked out" });

    const now = new Date();
    const hours = (now - new Date(attendance.clockIn)) / 3600000;
    const isEarly = now.getHours() < 17;

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: { clockOut: now, totalHours: Math.round(hours * 100) / 100, isEarlyExit: isEarly },
    });

    res.json(updated);
  } catch (err) { next(err); }
};

exports.getMyAttendance = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const m = parseInt(month) || new Date().getMonth() + 1;
    const y = parseInt(year) || new Date().getFullYear();

    const records = await prisma.attendance.findMany({
      where: {
        employeeId: req.employeeId,
        date: { gte: new Date(y, m - 1, 1), lt: new Date(y, m, 1) },
      },
      orderBy: { date: "desc" },
    });

    const stats = {
      present: records.filter((r) => r.status === "PRESENT").length,
      absent: records.filter((r) => r.status === "ABSENT").length,
      wfh: records.filter((r) => r.status === "WORK_FROM_HOME").length,
      late: records.filter((r) => r.isLateArrival).length,
      avgHours: records.length ? (records.reduce((s, r) => s + (r.totalHours || 0), 0) / records.length).toFixed(1) : 0,
    };

    res.json({ records, stats });
  } catch (err) { next(err); }
};

exports.getTeamAttendance = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = await prisma.attendance.findMany({
      where: { date: today },
      include: { employee: { select: { firstName: true, lastName: true, department: true, avatar: true } } },
    });

    const totalEmployees = await prisma.employee.count({ where: { status: "ACTIVE" } });

    res.json({
      date: today,
      totalEmployees,
      present: records.filter((r) => r.status === "PRESENT").length,
      absent: totalEmployees - records.length,
      wfh: records.filter((r) => r.status === "WORK_FROM_HOME").length,
      records,
    });
  } catch (err) { next(err); }
};
