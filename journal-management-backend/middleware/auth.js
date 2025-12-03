// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    // 401: Authorization denied (Unauthorized)
    return res.status(401).json({
      msg: 'No token, authorization denied'
    });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user ID and role from token payload to the request object
    // This makes the user's data accessible in the controllers (e.g., req.user.id)
    req.user = decoded; // The payload contains the user's ID
    next();
  } catch (err) {
    // 401: Token is not valid
    res.status(401).json({
      msg: 'Token is not valid'
    });
  }
};