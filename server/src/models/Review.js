const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: [true, 'Please provide a review comment'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
