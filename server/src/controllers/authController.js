const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const demo = require('../utils/demoData');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'friendlyecors_secret_jwt_key_2026_dallas', {
    expiresIn: '30d',
  });
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (global.dbFallback) {
      if (username === demo.admin.username && bcrypt.compareSync(password, demo.admin.passwordHash)) {
        return res.json({
          success: true,
          token: generateToken(demo.admin.id),
          admin: {
            id: demo.admin.id,
            username: demo.admin.username,
          },
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid username or password (Demo Mode)' });
    }

    const admin = await Admin.findOne({ username });
    if (admin && (await admin.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(admin._id),
        admin: {
          id: admin._id,
          username: admin.username,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyAdmin = async (req, res) => {
  res.json({
    success: true,
    admin: {
      id: req.admin ? req.admin._id : demo.admin.id,
      username: req.admin ? req.admin.username : demo.admin.username,
    },
  });
};

module.exports = { loginAdmin, verifyAdmin };
