const router = require("express").Router();
const auth = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

router.post("/login", auth.login);
router.post("/register", auth.register);
router.post("/refresh-token", auth.refreshToken);
router.post("/logout", authenticate, auth.logout);
router.get("/me", authenticate, auth.me);

module.exports = router;
