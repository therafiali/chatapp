const user_service = require("../services/user.service");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await user_service.getAllUsers();
    return res.status(201).json(users);
  } catch (e) {
    next(e);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await user_service.findByEmail(req.user.email);
    return res.status(201).json(user);
  } catch (e) {
    next(e);
  }
};
