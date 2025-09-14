const RefreshToken = require("../models/RefreshToken");
const { generateTokens } = require("../utils/jwt");

exports.create = async (userId, token) => {
  try {
    const refreshTokenDoc = new RefreshToken({
      token,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    await refreshTokenDoc.save();

    return refreshTokenDoc;
  } catch (error) {
    throw new Error("Failed to create refresh token");
  }
};

exports.deleteRefreshToken = async (userId) => {
  try {
    await RefreshToken.deleteMany({ userId });
    return true;
  } catch (error) {
    return false;
  }
};

exports.findRefreshToken = async (token) => {
  try {
    return await RefreshToken.findOne({ token });
  } catch (error) {
    return null;
  }
};


/**
 * Rotate refresh token - invalidate old, create new
 * @param {string} oldRefreshToken - Current refresh token
 * @param {Object} user - User object
 * @returns {Object} New tokens
 */
exports.rotateRefreshToken = async (oldRefreshToken, userId) => {
  try {
    const decoded = verifyRefreshToken(oldRefreshToken, userId);

    const storedToken = await RefreshToken.findOne({
      token: oldRefreshToken,
      userId: decoded.userId,
    });

    if (!storedToken) {
      throw new Error("Invalid refresh token");
    }

    await this.deleteRefreshToken(decoded.userId);

    const newTokens = generateTokens({
      _id: user._id || decoded.userId,
      email: user.email || decoded.email,
      name: user.name || decoded.name,
    });

    await this.create(decoded.userId, newTokens.refreshToken);
    return newTokens;
  } catch (e) {
    throw new Error(`Token rotation failed: ${e.message}`);
  }
};

/**
 * Revoke specific refresh token (for logout)
 * @param {string} refreshToken - Refresh token to revoke
 */
exports.revokeRefreshToken = async (refreshToken) => {
  try {
    await RefreshToken.deleteOne({ token: refreshToken });
  } catch (error) {
    throw new Error(`Failed to revoke refresh token: ${error.message}`);
  }
};


/**
 * Create initial refresh token with tokens (for login)
 * @param {Object} user - User object
 * @returns {Object} Tokens with refresh token stored in DB
 */
exports.createWithTokens = async (user) => {
  try {
    const tokens = generateTokens(user);
    
    // Store refresh token in database
    const refreshTokenDoc = new RefreshToken({
      token: tokens.refreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
    
    await refreshTokenDoc.save();
    
    return tokens;
  } catch (error) {
    throw new Error(`Failed to create refresh token: ${error.message}`);
  }
};
