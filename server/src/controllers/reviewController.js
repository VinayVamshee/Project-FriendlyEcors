const Review = require('../models/Review');
const demo = require('../utils/demoData');

const getApprovedReviews = async (req, res) => {
  try {
    const { featured } = req.query;

    if (global.dbFallback) {
      let filtered = demo.reviews.filter(r => r.status === 'approved');
      if (featured === 'true') {
        filtered = filtered.filter(r => r.isFeatured === true);
      }
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, data: filtered });
    }

    let query = { status: 'approved' };
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitReview = async (req, res) => {
  const { author, rating, comment } = req.body;

  if (!author || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'Please fill out all fields' });
  }

  try {
    if (global.dbFallback) {
      const newReview = {
        _id: 'rev_' + Date.now(),
        author,
        rating: Number(rating),
        comment,
        status: 'pending',
        isFeatured: false,
        createdAt: new Date(),
      };
      demo.reviews.push(newReview);
      return res.status(201).json({
        success: true,
        message: 'Review submitted successfully. It will display after admin approval.',
        data: newReview,
      });
    }

    const review = await Review.create({
      author,
      rating: Number(rating),
      comment,
      status: 'pending',
    });
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. It will display after admin approval.',
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminReviews = async (req, res) => {
  try {
    if (global.dbFallback) {
      const sorted = [...demo.reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, data: sorted });
    }
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateReviewStatus = async (req, res) => {
  const { status, isFeatured } = req.body;

  try {
    if (global.dbFallback) {
      const idx = demo.reviews.findIndex(r => r._id === req.params.id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Review not found (Demo Mode)' });
      }

      if (status !== undefined) demo.reviews[idx].status = status;
      if (isFeatured !== undefined) demo.reviews[idx].isFeatured = isFeatured;

      return res.json({ success: true, message: 'Review updated successfully', data: demo.reviews[idx] });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (status !== undefined) review.status = status;
    if (isFeatured !== undefined) review.isFeatured = isFeatured;

    await review.save();
    res.json({ success: true, message: 'Review updated successfully', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    if (global.dbFallback) {
      const idx = demo.reviews.findIndex(r => r._id === req.params.id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Review not found (Demo Mode)' });
      }
      demo.reviews.splice(idx, 1);
      return res.json({ success: true, message: 'Review deleted successfully' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    await Review.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getApprovedReviews,
  submitReview,
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
};
