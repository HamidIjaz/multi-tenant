const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const superAdminRoutes = require("./superAdminRoutes");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

// Public routes
router.use("/auth", authRoutes);
router.use("/tenant", authenticate, userRoutes);

// SuperAdmin routes
router.use(
  "/superadmin",
  authenticate,
  authorize("SuperAdmin"),
  superAdminRoutes
);

module.exports = router;
