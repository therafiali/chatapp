const { exists } = require("../models/User");
const auth = require("../services/auth.service");
const { verify } = require("../utils/crypto");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const { user, error } = await auth.signup(name, email, password);
    console.log("User", user);
    if (error === "EMAIL_IN_USE")
      return res.status(409).json({ message: "Email already exist" });

    return res.status(201).json(user);
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await auth.login(email, password);
    return res.status(201).json(user);
  } catch (e) {
    next(e);
  }
};
