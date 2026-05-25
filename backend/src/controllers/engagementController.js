const prisma = require("../config/database");

exports.checkinMood = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const checkin = await prisma.moodCheckin.upsert({
      where: { employeeId_date: { employeeId: req.employeeId, date: today } },
      update: { mood: req.body.mood, note: req.body.note },
      create: { employeeId: req.employeeId, mood: req.body.mood, note: req.body.note, date: today },
    });
    res.json(checkin);
  } catch (err) { next(err); }
};

exports.getMoodHistory = async (req, res, next) => {
  try {
    const checkins = await prisma.moodCheckin.findMany({
      where: { employeeId: req.employeeId },
      orderBy: { date: "desc" },
      take: 30,
    });
    res.json(checkins);
  } catch (err) { next(err); }
};

exports.getTeamMood = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const checkins = await prisma.moodCheckin.groupBy({
      by: ["mood"],
      where: { date: today },
      _count: true,
    });
    res.json(checkins.map((c) => ({ mood: c.mood, count: c._count })));
  } catch (err) { next(err); }
};

exports.giveRecognition = async (req, res, next) => {
  try {
    const recognition = await prisma.recognition.create({
      data: { giverId: req.employeeId, receiverId: req.body.receiverId, badge: req.body.badge, message: req.body.message, category: req.body.category },
    });
    res.status(201).json(recognition);
  } catch (err) { next(err); }
};

exports.getRecognitions = async (req, res, next) => {
  try {
    const recognitions = await prisma.recognition.findMany({
      include: {
        giver: { select: { firstName: true, lastName: true, avatar: true, department: true } },
        receiver: { select: { firstName: true, lastName: true, avatar: true, department: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json(recognitions);
  } catch (err) { next(err); }
};

exports.likeRecognition = async (req, res, next) => {
  try {
    const rec = await prisma.recognition.update({ where: { id: req.params.id }, data: { likes: { increment: 1 } } });
    res.json(rec);
  } catch (err) { next(err); }
};
