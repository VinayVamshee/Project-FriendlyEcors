const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'friendlyecors_secret_jwt_key_2026_dallas');

      if (global.dbFallback) {
        if (decoded.id === demo.admin.id) {
          req.admin = { _id: demo.admin.id, username: demo.admin.username };
          return next();
        }
        return res.status(401).json({ success: false, message: 'Not authorized, admin session expired' });
      }

      req.admin = await Admin.findById(decoded.id).select('-password');
      if (!req.admin) {
        return res.status(401).json({ success: false, message: 'Not authorized, admin user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
