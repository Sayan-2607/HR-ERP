const prisma = require("../config/database");
const redis = require("../config/redis");

exports.getDashboard = async (req, res, next) => {
  try {
    const cacheKey = "analytics:dashboard";
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const [
      totalEmployees, activeEmployees, departments, avgAttrition,
      pendingLeaves, openTickets, activeCourses, todayAttendance,
    ] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { status: "ACTIVE" } }),
      prisma.employee.groupBy({ by: ["department"], _count: true, where: { status: "ACTIVE" } }),
      prisma.employee.aggregate({ _avg: { attritionRisk: true } }),
      prisma.leaveRequest.count({ where: { status: "PENDING" } }),
      prisma.ticket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
      prisma.course.count({ where: { status: "ACTIVE" } }),
      prisma.attendance.count({ where: { date: new Date(new Date().toISOString().split("T")[0]), status: "PRESENT" } }),
    ]);

    const data = {
      totalEmployees, activeEmployees, pendingLeaves, openTickets, activeCourses, todayAttendance,
      avgAttritionRisk: Math.round((avgAttrition._avg.attritionRisk || 0) * 100) / 100,
      departments: departments.map((d) => ({ name: d.department, count: d._count })),
      retentionRate: totalEmployees ? Math.round((activeEmployees / totalEmployees) * 100) : 0,
    };

    await redis.setex(cacheKey, 120, JSON.stringify(data));
    res.json(data);
  } catch (err) { next(err); }
};

exports.getHeadcount = async (req, res, next) => {
  try {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const count = await prisma.employee.count({
        where: { joiningDate: { lte: new Date(d.getFullYear(), d.getMonth() + 1, 0) }, OR: [{ exitDate: null }, { exitDate: { gt: new Date(d.getFullYear(), d.getMonth() + 1, 0) } }] },
      });
      months.push({ month: d.toLocaleString("default", { month: "short" }), year: d.getFullYear(), count });
    }
    res.json(months);
  } catch (err) { next(err); }
};

exports.getAttritionRisk = async (req, res, next) => {
  try {
    const employees = await prisma.employee.findMany({
      where: { status: "ACTIVE", attritionRisk: { gt: 0.4 } },
      select: { id: true, firstName: true, lastName: true, department: true, designation: true, attritionRisk: true, avatar: true },
      orderBy: { attritionRisk: "desc" },
      take: 20,
    });
    res.json(employees);
  } catch (err) { next(err); }
};

exports.getDiversity = async (req, res, next) => {
  try {
    const [gender, departments, employment] = await Promise.all([
      prisma.employee.groupBy({ by: ["gender"], _count: true, where: { status: "ACTIVE" } }),
      prisma.employee.groupBy({ by: ["department"], _count: true, where: { status: "ACTIVE" } }),
      prisma.employee.groupBy({ by: ["employmentType"], _count: true, where: { status: "ACTIVE" } }),
    ]);
    res.json({ gender: gender.map((g) => ({ label: g.gender, count: g._count })), departments: departments.map((d) => ({ label: d.department, count: d._count })), employmentTypes: employment.map((e) => ({ label: e.employmentType, count: e._count })) });
  } catch (err) { next(err); }
};
