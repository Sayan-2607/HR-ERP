const router = require("express").Router();
const ctrl = require("../controllers/performanceController");
const { authenticate, isManager } = require("../middleware/auth");

router.use(authenticate);
router.get("/reviews", ctrl.getReviews);
router.get("/reviews/my", ctrl.getMyReviews);
router.post("/reviews/self", ctrl.submitSelfReview);
router.put("/reviews/:id/manager", isManager, ctrl.submitManagerReview);
router.get("/goals", ctrl.getGoals);
router.post("/goals", ctrl.createGoal);
router.put("/goals/:id", ctrl.updateGoal);
router.post("/feedback", ctrl.submitFeedback);
router.get("/feedback", ctrl.getFeedback);

module.exports = router;
