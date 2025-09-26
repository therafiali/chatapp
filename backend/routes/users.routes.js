
const ctrl = require("../controllers/users.controller");
const express = require("express");
const { authenticate } = require("../middleware/auth");
const router = express.Router();


router.get("/get", authenticate, ctrl.getAllUsers);
router.get("/user/me", authenticate, ctrl.getCurrentUser);

module.exports = router;
