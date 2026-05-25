const router = require("express").Router();
const ctrl = require("../controllers/helpdeskController");
const { authenticate, isHR } = require("../middleware/auth");

router.use(authenticate);
router.post("/", ctrl.create);
router.get("/", isHR, ctrl.getAll);
router.get("/my", ctrl.getMyTickets);
router.get("/stats", ctrl.getStats);
router.put("/:id", ctrl.update);
router.post("/:id/messages", ctrl.addMessage);
router.get("/:id/messages", ctrl.getMessages);

module.exports = router;
