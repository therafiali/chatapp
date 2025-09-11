const User = require("../models/User");

exports.findByEmail = (email) => User.findOne({ email });

exports.create = (data) => User.create(data);

exports.getAllUsers = () => User.find({}, { passwordHash: 0 }).lean();



