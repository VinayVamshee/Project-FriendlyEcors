const express = require('express');
const router = express.Router();
const { loginAdmin, verifyAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', loginAdmin);
router.get('/verify', protect, verifyAdmin);

module.exports = router;
