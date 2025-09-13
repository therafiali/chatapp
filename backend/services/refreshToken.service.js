const RefreshToken = require("../models/RefreshToken");

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
