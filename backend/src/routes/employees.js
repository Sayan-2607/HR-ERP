const router = require("express").Router();
const ctrl = require("../controllers/employeeController");
const { authenticate, isHR } = require("../middleware/auth");

router.use(authenticate);
router.get("/", ctrl.getAll);
router.get("/stats", ctrl.getStats);
router.get("/departments", ctrl.getDepartments);
router.get("/:id", ctrl.getById);
router.post("/", isHR, ctrl.create);
router.put("/:id", isHR, ctrl.update);
router.delete("/:id", isHR, ctrl.delete);

module.exports = router;
