const prisma = require("../config/database");

exports.getAll = async (req, res, next) => {
  try {
    const { month, year, status } = req.query;
    const where = {};
    if (month) where.month = parseInt(month);
    if (year) where.year = parseInt(year);
    if (status) where.status = status;

    const payrolls = await prisma.payroll.findMany({
      where,
      include: { employee: { select: { firstName: true, lastName: true, employeeId: true, department: true, designation: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(payrolls);
  } catch (err) { next(err); }
};

exports.getMine = async (req, res, next) => {
  try {
    const payrolls = await prisma.payroll.findMany({
      where: { employeeId: req.employeeId },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });
    res.json(payrolls);
  } catch (err) { next(err); }
};

exports.generate = async (req, res, next) => {
  try {
    const { month, year } = req.body;
    const employees = await prisma.employee.findMany({ where: { status: "ACTIVE" } });

    const payrolls = [];
    for (const emp of employees) {
      const basic = Number(emp.salary) || 50000;
      const hra = Math.round(basic * 0.4);
      const da = Math.round(basic * 0.1);
      const special = Math.round(basic * 0.15);
      const gross = basic + hra + da + special;
      const pf = Math.round(basic * 0.12);
      const esi = gross < 21000 ? Math.round(gross * 0.0075) : 0;
      const tax = gross > 100000 ? Math.round(gross * 0.1) : gross > 50000 ? Math.round(gross * 0.05) : 0;
      const totalDeduct = pf + esi + tax;

      payrolls.push({
        employeeId: emp.id, month, year,
        basicSalary: basic, hra, da, specialAllow: special,
        grossSalary: gross, pf, esi, tax, totalDeduct,
        netSalary: gross - totalDeduct, status: "DRAFT",
      });
    }

    const result = await prisma.$transaction(
      payrolls.map((p) =>
        prisma.payroll.upsert({
          where: { employeeId_month_year: { employeeId: p.employeeId, month: p.month, year: p.year } },
          update: p, create: p,
        })
      )
    );

    res.json({ message: `Payroll generated for ${result.length} employees`, count: result.length });
  } catch (err) { next(err); }
};

exports.process = async (req, res, next) => {
  try {
    const { month, year } = req.body;
    await prisma.payroll.updateMany({
      where: { month, year, status: "DRAFT" },
      data: { status: "PROCESSED" },
    });
    res.json({ message: "Payroll processed successfully" });
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    const current = await prisma.payroll.aggregate({
      where: { month, year },
      _sum: { grossSalary: true, netSalary: true, totalDeduct: true, tax: true, pf: true },
      _count: true,
    });

    const monthlyTrend = await prisma.payroll.groupBy({
      by: ["month"],
      where: { year },
      _sum: { netSalary: true, grossSalary: true },
      _count: true,
      orderBy: { month: "asc" },
    });

    res.json({
      current: { ...current._sum, employeeCount: current._count },
      monthlyTrend: monthlyTrend.map((m) => ({ month: m.month, netSalary: m._sum.netSalary, gross: m._sum.grossSalary, count: m._count })),
    });
  } catch (err) { next(err); }
};
