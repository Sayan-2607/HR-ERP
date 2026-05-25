const prisma = require("../config/database");

exports.create = async (req, res, next) => {
  try {
    const count = await prisma.ticket.count();
    const ticket = await prisma.ticket.create({
      data: {
        ticketNo: `TKT-${String(count + 1001).padStart(6, "0")}`,
        employeeId: req.employeeId,
        category: req.body.category,
        subject: req.body.subject,
        description: req.body.description,
        priority: req.body.priority || "MEDIUM",
        slaDeadline: new Date(Date.now() + (req.body.priority === "URGENT" ? 4 : req.body.priority === "HIGH" ? 8 : 24) * 3600000),
      },
    });
    res.status(201).json(ticket);
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const { status, priority, category } = req.query;
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;

    const tickets = await prisma.ticket.findMany({
      where,
      include: { employee: { select: { firstName: true, lastName: true, department: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(tickets);
  } catch (err) { next(err); }
};

exports.getMyTickets = async (req, res, next) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { employeeId: req.employeeId },
      orderBy: { createdAt: "desc" },
    });
    res.json(tickets);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.body.status === "RESOLVED") data.resolvedAt = new Date();
    const ticket = await prisma.ticket.update({ where: { id: req.params.id }, data });
    res.json(ticket);
  } catch (err) { next(err); }
};

exports.addMessage = async (req, res, next) => {
  try {
    const message = await prisma.ticketMessage.create({
      data: { ticketId: req.params.id, sender: `${req.user.employee?.firstName || "System"}`, message: req.body.message, isInternal: req.body.isInternal || false },
    });
    res.status(201).json(message);
  } catch (err) { next(err); }
};

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await prisma.ticketMessage.findMany({
      where: { ticketId: req.params.id },
      orderBy: { createdAt: "asc" },
    });
    res.json(messages);
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const [open, inProgress, resolved, urgent] = await Promise.all([
      prisma.ticket.count({ where: { status: "OPEN" } }),
      prisma.ticket.count({ where: { status: "IN_PROGRESS" } }),
      prisma.ticket.count({ where: { status: "RESOLVED" } }),
      prisma.ticket.count({ where: { priority: "URGENT", status: { not: "RESOLVED" } } }),
    ]);
    const avgResolution = await prisma.$queryRaw`SELECT AVG(EXTRACT(EPOCH FROM ("resolvedAt" - "createdAt"))/3600) as avg_hours FROM tickets WHERE "resolvedAt" IS NOT NULL`;
    res.json({ open, inProgress, resolved, urgent, avgResolutionHours: Math.round(avgResolution[0]?.avg_hours || 0) });
  } catch (err) { next(err); }
};
