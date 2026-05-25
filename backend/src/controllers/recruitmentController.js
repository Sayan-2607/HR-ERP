const prisma = require("../config/database");

exports.getJobs = async (req, res, next) => {
  try {
    const { status, department } = req.query;
    const where = {};
    if (status) where.status = status;
    if (department) where.department = department;

    const jobs = await prisma.jobPosting.findMany({
      where,
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(jobs);
  } catch (err) { next(err); }
};

exports.createJob = async (req, res, next) => {
  try {
    const job = await prisma.jobPosting.create({ data: { ...req.body, postedBy: req.user.id } });
    res.status(201).json(job);
  } catch (err) { next(err); }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await prisma.jobPosting.update({ where: { id: req.params.id }, data: req.body });
    res.json(job);
  } catch (err) { next(err); }
};

exports.getApplications = async (req, res, next) => {
  try {
    const { jobId, stage } = req.query;
    const where = {};
    if (jobId) where.jobId = jobId;
    if (stage) where.stage = stage;

    const apps = await prisma.application.findMany({
      where,
      include: { job: { select: { title: true, department: true } } },
      orderBy: { aiScore: "desc" },
    });
    res.json(apps);
  } catch (err) { next(err); }
};

exports.createApplication = async (req, res, next) => {
  try {
    // AI scoring simulation
    const skills = req.body.skills || [];
    const experience = req.body.experience || 0;
    const aiScore = Math.min(100, Math.round(50 + experience * 3 + skills.length * 5 + Math.random() * 15));

    const app = await prisma.application.create({
      data: { ...req.body, aiScore, aiSummary: `Candidate scored ${aiScore}/100 based on experience and skill match.` },
    });
    res.status(201).json(app);
  } catch (err) { next(err); }
};

exports.updateStage = async (req, res, next) => {
  try {
    const app = await prisma.application.update({
      where: { id: req.params.id },
      data: { stage: req.body.stage, notes: req.body.notes },
    });
    res.json(app);
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const [openJobs, totalApps, pipeline, hired] = await Promise.all([
      prisma.jobPosting.count({ where: { status: "OPEN" } }),
      prisma.application.count(),
      prisma.application.groupBy({ by: ["stage"], _count: true }),
      prisma.application.count({ where: { stage: "HIRED" } }),
    ]);
    res.json({
      openPositions: openJobs, totalApplications: totalApps, totalHired: hired,
      pipeline: pipeline.map((p) => ({ stage: p.stage, count: p._count })),
    });
  } catch (err) { next(err); }
};
