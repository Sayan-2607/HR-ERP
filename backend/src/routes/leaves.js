const router = require("express").Router();
const ctrl = require("../controllers/leaveController");
const { authenticate, isManager } = require("../middleware/auth");

router.use(authenticate);
router.post("/apply", ctrl.apply);
router.get("/my", ctrl.getMyLeaves);
router.get("/stats", ctrl.getStats);
router.get("/pending", isManager, ctrl.getPending);
router.put("/:id/approve", isManager, ctrl.approve);
router.put("/:id/reject", isManager, ctrl.reject);

module.exports = router;
