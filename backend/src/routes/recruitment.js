const router = require("express").Router();
const ctrl = require("../controllers/recruitmentController");
const { authenticate, isHR } = require("../middleware/auth");

router.use(authenticate);
router.get("/jobs", ctrl.getJobs);
router.post("/jobs", isHR, ctrl.createJob);
router.put("/jobs/:id", isHR, ctrl.updateJob);
router.get("/applications", ctrl.getApplications);
router.post("/applications", ctrl.createApplication);
router.put("/applications/:id/stage", isHR, ctrl.updateStage);
router.get("/stats", ctrl.getStats);

module.exports = router;
