const prisma = require("../config/database");

exports.getReviews = async (req, res, next) => {
  try {
    const { year, status } = req.query;
    const where = {};
    if (year) where.year = parseInt(year);
    if (status) where.status = status;

    const reviews = await prisma.performance.findMany({
      where,
      include: { employee: { select: { firstName: true, lastName: true, department: true, designation: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (err) { next(err); }
};

exports.getMyReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.performance.findMany({
      where: { employeeId: req.employeeId },
      orderBy: { year: "desc" },
    });
    res.json(reviews);
  } catch (err) { next(err); }
};

exports.submitSelfReview = async (req, res, next) => {
  try {
    const review = await prisma.performance.upsert({
      where: { id: req.body.reviewId || "new" },
      update: { selfRating: req.body.rating, strengths: req.body.strengths, improvements: req.body.improvements, status: "SELF_REVIEW" },
      create: {
        employeeId: req.employeeId, reviewCycle: req.body.cycle || "Annual",
        year: new Date().getFullYear(), selfRating: req.body.rating,
        strengths: req.body.strengths, improvements: req.body.improvements, status: "SELF_REVIEW",
      },
    });
    res.json(review);
  } catch (err) { next(err); }
};

exports.submitManagerReview = async (req, res, next) => {
  try {
    const review = await prisma.performance.update({
      where: { id: req.params.id },
      data: { managerRating: req.body.rating, finalRating: req.body.rating, comments: req.body.comments, status: "COMPLETED", reviewedBy: req.user.id, reviewedAt: new Date() },
    });
    res.json(review);
  } catch (err) { next(err); }
};

exports.getGoals = async (req, res, next) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { employeeId: req.query.employeeId || req.employeeId },
      orderBy: { createdAt: "desc" },
    });
    res.json(goals);
  } catch (err) { next(err); }
};

exports.createGoal = async (req, res, next) => {
  try {
    const goal = await prisma.goal.create({
      data: { ...req.body, employeeId: req.body.employeeId || req.employeeId },
    });
    res.status(201).json(goal);
  } catch (err) { next(err); }
};

exports.updateGoal = async (req, res, next) => {
  try {
    const goal = await prisma.goal.update({ where: { id: req.params.id }, data: req.body });
    res.json(goal);
  } catch (err) { next(err); }
};

exports.submitFeedback = async (req, res, next) => {
  try {
    const feedback = await prisma.feedbackGiven.create({
      data: { giverId: req.employeeId, receiverId: req.body.receiverId, type: req.body.type || "PEER", rating: req.body.rating, feedback: req.body.feedback, isAnonymous: req.body.isAnonymous || false },
    });
    res.status(201).json(feedback);
  } catch (err) { next(err); }
};

exports.getFeedback = async (req, res, next) => {
  try {
    const feedback = await prisma.feedbackGiven.findMany({
      where: { receiverId: req.query.employeeId || req.employeeId },
      include: { giver: { select: { firstName: true, lastName: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(feedback.map((f) => f.isAnonymous ? { ...f, giver: { firstName: "Anonymous", lastName: "" } } : f));
  } catch (err) { next(err); }
};
