const { decode } = require("jsonwebtoken");
const { getTokenFromCookie } = require("../utils/cookies");
const {
  extractTokenFromHeader,
  verifyAccessToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const { rotateRefreshToken } = require("../services/refreshToken.service");

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    let accessToken = extractTokenFromHeader(authHeader);

    if (!accessToken) {
      accessToken = getTokenFromCookie(req, "accessToken");
    }
    if (!accessToken) {
      return res.status(401).json({ message: "Access token required" });
    }

    try {
      const decoded = verifyAccessToken(accessToken);

      req.user = decoded;
      return next();
    } catch (accessTokenError) {
      return await handleTokenRotation(req, res, next);
    }
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

const handleTokenRotation = async (req, res, next) => {
  try {
    const refreshToken = getTokenFromCookie(req, "refreshToken");
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Session expired, please login again" });
    }

    const refreshDecoded = verifyRefreshToken(refreshToken);

    const newTokens = await rotateRefreshToken(refreshToken, refreshDecoded);

    setAuthCookies(res, newTokens);

    // Add user info to request
    req.user = refreshDecoded;

    return next();
  } catch (refreshTokenError) {
    return res
      .status(401)
      .json({ message: "Session expired, please login again" });
  }
};
