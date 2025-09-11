const { hash, verify } = require("../utils/crypto");
const users = require("./user.service");

exports.signup = async (name, email, password) => {
  const exist = await users.findByEmail(email);

  if (exist) return { error: "EMAIL_IN_USE" };

  const passwordHash = await hash(password);

  const user = await users.create({ name, email, passwordHash });

  return { user: { id: user._id, name: user.name, createdAt: user.createdAt } };
};

exports.login = async (email, password) => {
  const exist = await users.findByEmail(email);

  if (!exist) return { error: "invalid_email" };

  const isVerified = await verify(password, exist.passwordHash);

  if (!isVerified) return "invalid_password";

  return "Verified";
};
