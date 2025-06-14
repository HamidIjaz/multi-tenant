const express = require("express");
const router = express.Router();
const superAdminController = require("../controllers/superAdminController");

router.get("/tenants", superAdminController.getAllTenants);

module.exports = router;
