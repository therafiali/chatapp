
const ctrl = require("../controllers/users.controller");
const express = require("express");
const { authenticate } = require("../middleware/auth");
const router = express.Router();


router.get("/get", authenticate, ctrl.getAllUsers);

module.exports = router;
