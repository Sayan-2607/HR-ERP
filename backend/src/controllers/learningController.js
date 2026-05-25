const prisma = require("../config/database");

exports.getCourses = async (req, res, next) => {
  try {
    const { category, level } = req.query;
    const where = { status: "ACTIVE" };
    if (category) where.category = category;
    if (level) where.level = level;

    const courses = await prisma.course.findMany({
      where,
      include: { _count: { select: { enrollments: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(courses);
  } catch (err) { next(err); }
};

exports.createCourse = async (req, res, next) => {
  try {
    const course = await prisma.course.create({ data: req.body });
    res.status(201).json(course);
  } catch (err) { next(err); }
};

exports.enroll = async (req, res, next) => {
  try {
    const enrollment = await prisma.courseEnrollment.create({
      data: { employeeId: req.employeeId, courseId: req.params.id, startedAt: new Date(), status: "IN_PROGRESS" },
    });
    res.status(201).json(enrollment);
  } catch (err) { next(err); }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const data = { progress: req.body.progress };
    if (req.body.progress >= 100) { data.status = "COMPLETED"; data.completedAt = new Date(); data.score = req.body.score; }
    const enrollment = await prisma.courseEnrollment.update({ where: { id: req.params.id }, data });
    res.json(enrollment);
  } catch (err) { next(err); }
};

exports.getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { employeeId: req.employeeId },
      include: { course: true },
      orderBy: { updatedAt: "desc" },
    });
    res.json(enrollments);
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const [totalCourses, totalEnrollments, completed, inProgress] = await Promise.all([
      prisma.course.count({ where: { status: "ACTIVE" } }),
      prisma.courseEnrollment.count(),
      prisma.courseEnrollment.count({ where: { status: "COMPLETED" } }),
      prisma.courseEnrollment.count({ where: { status: "IN_PROGRESS" } }),
    ]);
    res.json({ totalCourses, totalEnrollments, completed, inProgress, completionRate: totalEnrollments ? Math.round((completed / totalEnrollments) * 100) : 0 });
  } catch (err) { next(err); }
};
