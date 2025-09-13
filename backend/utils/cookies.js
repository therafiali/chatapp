/**
 * Cookie utility module for production-level authentication
 */

// Cookie configuration for different token types
const COOKIE_CONFIGS = {
    accessToken: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // CSRF protection
      maxAge: 15 * 60 * 1000, // 15 minutes
      name: 'accessToken'
    },
    
    refreshToken: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      name: 'refreshToken'
    }
  };
  
  /**
   * Set authentication cookies
   * @param {Object} res - Express response object
   * @param {Object} tokens - Object containing accessToken and refreshToken
   */
  const setAuthCookies = (res, tokens) => {
    const { accessToken, refreshToken } = tokens;
    
    if (accessToken) {
      res.cookie(COOKIE_CONFIGS.accessToken.name, accessToken, {
        httpOnly: COOKIE_CONFIGS.accessToken.httpOnly,
        secure: COOKIE_CONFIGS.accessToken.secure,
        sameSite: COOKIE_CONFIGS.accessToken.sameSite,
        maxAge: COOKIE_CONFIGS.accessToken.maxAge
      });
    }
    
    if (refreshToken) {
      res.cookie(COOKIE_CONFIGS.refreshToken.name, refreshToken, {
        httpOnly: COOKIE_CONFIGS.refreshToken.httpOnly,
        secure: COOKIE_CONFIGS.refreshToken.secure,
        sameSite: COOKIE_CONFIGS.refreshToken.sameSite,
        maxAge: COOKIE_CONFIGS.refreshToken.maxAge
      });
    }
  };
  
  /**
   * Clear authentication cookies
   * @param {Object} res - Express response object
   */
  const clearAuthCookies = (res) => {
    res.clearCookie(COOKIE_CONFIGS.accessToken.name);
    res.clearCookie(COOKIE_CONFIGS.refreshToken.name);
  };
  
  /**
   * Get token from cookies
   * @param {Object} req - Express request object
   * @param {string} tokenType - 'accessToken' or 'refreshToken'
   * @returns {string|null} Token value or null
   */
  const getTokenFromCookie = (req, tokenType = 'accessToken') => {
    const config = COOKIE_CONFIGS[tokenType];
    if (!config) return null;
    
    return req.cookies[config.name] || null;
  };
  
  /**
   * Set a custom cookie with configuration
   * @param {Object} res - Express response object
   * @param {string} name - Cookie name
   * @param {string} value - Cookie value
   * @param {Object} options - Cookie options
   */
  const setCookie = (res, name, value, options = {}) => {
    const defaultOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };
    
    res.cookie(name, value, { ...defaultOptions, ...options });
  };
  
  /**
   * Clear a specific cookie
   * @param {Object} res - Express response object
   * @param {string} name - Cookie name
   */
  const clearCookie = (res, name) => {
    res.clearCookie(name);
  };
  
  module.exports = {
    setAuthCookies,
    clearAuthCookies,
    getTokenFromCookie,
    setCookie,
    clearCookie,
    COOKIE_CONFIGS
  };