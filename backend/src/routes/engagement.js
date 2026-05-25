const router = require("express").Router();
const ctrl = require("../controllers/engagementController");
const { authenticate, isHR } = require("../middleware/auth");

router.use(authenticate);
router.post("/mood", ctrl.checkinMood);
router.get("/mood/history", ctrl.getMoodHistory);
router.get("/mood/team", isHR, ctrl.getTeamMood);
router.post("/recognition", ctrl.giveRecognition);
router.get("/recognition", ctrl.getRecognitions);
router.put("/recognition/:id/like", ctrl.likeRecognition);

module.exports = router;
