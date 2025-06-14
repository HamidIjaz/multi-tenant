const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticate = require("../middleware/authenticate");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/profile", authenticate, authController.getProfile);

// Google OAuth routes would go here
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// router.get('/google/callback', passport.authenticate('google', { session: false }), authController.googleCallback);

module.exports = router;
