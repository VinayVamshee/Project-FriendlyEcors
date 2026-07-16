const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  phone: {
    type: String,
    default: '+1 (214) 555-0199',
  },
  whatsapp: {
    type: String,
    default: '12145550199', // Clean number for link direct prefix e.g., wa.me/12145550199
  },
  instagram: {
    type: String,
    default: 'friendlyecors',
  },
  facebook: {
    type: String,
    default: 'friendlyecors',
  },
  address: {
    type: String,
    default: 'Dallas, TX',
  },
  hours: {
    type: String,
    default: 'Mon - Sat: 9:00 AM - 6:00 PM | Sun: Closed',
  },
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
