const user_service = require("../services/user.service");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await user_service.getAllUsers();
    return res.status(201).json(users);
  } catch (e) {
    next(e);
  }
};
