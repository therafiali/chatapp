const { hash } = require("../utils/crypto");
const users = require("./user.service");

exports.signup = async (name, email, password) => {
  const exist = await users.findByEmail(email);
  console.log("Exuist", exist);
  if (exist) return { error: "EMAIL_IN_USE" };

  const passwordHash = await hash(password);

  const user = await users.create({ name, email, passwordHash });

  return { user: { id: user._id, name: user.name, createdAt: user.createdAt } };
};
