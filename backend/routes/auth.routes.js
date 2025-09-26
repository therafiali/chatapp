const { signupSchema, validate } = require("../middleware/validate");
const ctrl = require("../controllers/auth.controller");
const express = require("express");
const router = express.Router();

router.post("/signup", validate(signupSchema), ctrl.signup);
router.post("/login", ctrl.login);
router.get("/logout", ctrl.logout);
router.get("/refresh", ctrl.refresh);

module.exports = router;
