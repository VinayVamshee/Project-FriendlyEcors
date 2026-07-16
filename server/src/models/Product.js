const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a product title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a rental price'],
  },
  duration: {
    type: String,
    default: 'Daily',
  },
  images: {
    type: [String],
    required: [true, 'Please provide at least one product image'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category'],
  },
  dimensions: {
    type: String,
    default: '',
  },
  included: {
    type: [String],
    default: [],
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
