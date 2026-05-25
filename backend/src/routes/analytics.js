const router = require("express").Router();
const ctrl = require("../controllers/analyticsController");
const { authenticate, isHR } = require("../middleware/auth");

router.use(authenticate);
router.get("/dashboard", ctrl.getDashboard);
router.get("/headcount", isHR, ctrl.getHeadcount);
router.get("/attrition", isHR, ctrl.getAttritionRisk);
router.get("/diversity", isHR, ctrl.getDiversity);

module.exports = router;
