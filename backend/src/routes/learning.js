const router = require("express").Router();
const ctrl = require("../controllers/learningController");
const { authenticate, isHR } = require("../middleware/auth");

router.use(authenticate);
router.get("/courses", ctrl.getCourses);
router.post("/courses", isHR, ctrl.createCourse);
router.post("/courses/:id/enroll", ctrl.enroll);
router.put("/enrollments/:id/progress", ctrl.updateProgress);
router.get("/my-enrollments", ctrl.getMyEnrollments);
router.get("/stats", ctrl.getStats);

module.exports = router;
