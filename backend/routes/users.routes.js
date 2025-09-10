
const ctrl = require("../controllers/users.controller");
const express = require("express");
const router = express.Router();


router.get("/get", ctrl.getAllUsers);

module.exports = router;
