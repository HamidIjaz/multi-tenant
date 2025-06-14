const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.get("/", userController.getTenant);
router.post("/users", authorize("Admin"), userController.createUser);

module.exports = router;
