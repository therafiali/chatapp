const User = require("../models/User");
const auth = require("../services/auth.service");
const {
  deleteRefreshToken,
  createWithTokens,
} = require("../services/refreshToken.service");
const {
  clearAuthCookies,
  setAuthCookies,
  getTokenFromCookie,
} = require("../utils/cookies");
const { verifyRefreshToken } = require("../utils/jwt");

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

    if (user.error === "invalid_email") {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.error === "invalid_password") {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    setAuthCookies(res, user.tokens);

    return res.status(200).json({
      message: "Login successfull",
      user: user.user,
      accessToken: user.tokens.accessToken,
      refreshToken: user.tokens.refreshToken,
    });
  } catch (e) {
    next(e);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // Clear authentication cookies using modular approach
    clearAuthCookies(res);

    return res.status(200).json({ message: "Logout successful" });
  } catch (e) {
    next(e);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const refreshToken = getTokenFromCookie(req, "refreshToken");
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    await deleteRefreshToken(user._id);
    const tokens = await createWithTokens(user); // { accessToken, refreshToken }

    setAuthCookies(res, tokens);

    return res.status(200).json({ accessToken: tokens.accessToken });
  } catch (e) {
    return res.status(401).json({ message: "Session expired, please login again" });
  }
};
