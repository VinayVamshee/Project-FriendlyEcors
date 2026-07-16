const mongoose = require('mongoose');

const GalleryItemSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },
  eventName: {
    type: String,
    required: [true, 'Please provide an event name'],
    trim: true,
  },
  location: {
    type: String,
    default: 'Dallas, TX',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide a category for the setup'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('GalleryItem', GalleryItemSchema);
