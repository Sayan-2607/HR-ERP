const router = require("express").Router();
const ctrl = require("../controllers/aiController");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);
router.post("/chat", ctrl.chat);
router.get("/suggestions", ctrl.getSuggestions);

module.exports = router;
