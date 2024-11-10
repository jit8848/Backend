const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      const extractedToken = token.replace('Bearer ', '');
      const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);
      req.user = decoded.user;

      // Check if the role is allowed
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    } catch (err) {
      console.error('Error verifying token:', err.message);
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = auth;
