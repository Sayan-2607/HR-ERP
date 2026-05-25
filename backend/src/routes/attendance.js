const router = require("express").Router();
const ctrl = require("../controllers/attendanceController");
const { authenticate, isHR } = require("../middleware/auth");

router.use(authenticate);
router.post("/clock-in", ctrl.clockIn);
router.post("/clock-out", ctrl.clockOut);
router.get("/my", ctrl.getMyAttendance);
router.get("/team", isHR, ctrl.getTeamAttendance);

module.exports = router;
