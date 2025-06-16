const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const superAdminRoutes = require("./superAdminRoutes");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.use("/auth", authRoutes);
router.use("/tenant", authenticate, userRoutes);

router.use(
  "/superadmin",
  authenticate,
  authorize("SuperAdmin"),
  superAdminRoutes
);

module.exports = router;
