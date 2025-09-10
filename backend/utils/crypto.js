const bcrypt = require("bcrypt");

exports.hash = (plain) => bcrypt.hash(plain, 10);

exports.verify = (plain, hash) => bcrypt.compare(plain, hash);
