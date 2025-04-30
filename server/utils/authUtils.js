
const jwt = require('jsonwebtoken');

/**
 * Middleware to verify user authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const verifyAuth = (req, res, next) => {
  // Check if token exists in the request headers
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ message: 'No access token provided - add x-access-token to the request headers' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // Handle different token verification errors
    if (err) {
      switch (err.name) {
        case 'TokenExpiredError':
          return res.status(401).json({
            message: 'Token has expired. Please login again.',
          });
        case 'JsonWebTokenError':
          return res.status(401).json({
            message: 'Invalid token. Please login again.',
          });
        default:
          return res.status(500).json({
            message: 'Failed to authenticate token.',
          });
      }
    }
    
    // If token is valid, save decoded info to request object for use in other routes
    req.middlewareParams = req.middlewareParams || {} ;
    req.middlewareParams.user = decoded?.user || null;
    req.middlewareParams.userId = decoded?.user?.id || null;
    // console.log('req.middlewareParams', req.middlewareParams);
    next();
  });
};

module.exports = verifyAuth;