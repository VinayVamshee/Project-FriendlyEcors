const express = require('express');
const router = express.Router();
const {
  getApprovedReviews,
  submitReview,
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/', getApprovedReviews);
router.post('/', submitReview);
router.get('/admin', protect, getAdminReviews);
router.put('/:id/status', protect, updateReviewStatus);
router.delete('/:id', protect, deleteReview);

module.exports = router;
