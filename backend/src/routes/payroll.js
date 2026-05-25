const router = require("express").Router();
const ctrl = require("../controllers/payrollController");
const { authenticate, isHR } = require("../middleware/auth");

router.use(authenticate);
router.get("/", isHR, ctrl.getAll);
router.get("/my", ctrl.getMine);
router.get("/stats", isHR, ctrl.getStats);
router.post("/generate", isHR, ctrl.generate);
router.post("/process", isHR, ctrl.process);

module.exports = router;
