const jwt = require("jsonwebtoken");

const JWT_CONFIG = {
  accessTokenSecret:
    process.env.JWT_ACCESS_SECRET ||
    "your-super-secret-access-key-change-in-production",
  refreshTokenSecret:
    process.env.JWT_REFRESH_SECRET ||
    "your-super-secret-refresh-key-change-in-production",
  accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || "1m",
  refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
};

/**
 * Generate access token
 * @param {Object} payload - User data to encode
 * @returns {string} Access token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_CONFIG.accessTokenSecret, {
    expiresIn: JWT_CONFIG.accessTokenExpiry,
    issuer: "chatapp",
    audience: "chatapp-users",
  });
};

/**
 * Generate refresh token
 * @param {Object} payload - User data to encode
 * @returns {string} Refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_CONFIG.refreshTokenSecret, {
    expiresIn: JWT_CONFIG.refreshTokenExpiry,
    issuer: "chatapp",
    audience: "chatapp-users",
  });
};

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object
 * @returns {Object} Tokens object
 */
const generateTokens = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    name: user.name,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

/**
 * Verify access token
 * @param {string} token - Access token to verify
 * @returns {Object} Decoded token payload
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.accessTokenSecret, {
      issuer: "chatapp",
      audience: "chatapp-users",
    });
  } catch (e) {
    throw new Error("Invalid or expired access token");
  }
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token to verify
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.refreshTokenSecret, {
      issuer: "chatapp",
      audience: "chatapp-users",
    });
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Extracted token or null
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  return authHeader.substring(7);
};

module.exports = {
  generateTokens,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  extractTokenFromHeader,
};
