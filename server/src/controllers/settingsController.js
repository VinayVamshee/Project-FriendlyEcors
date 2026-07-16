const Settings = require('../models/Settings');

const getSettings = async (req, res) => {
  try {
    if (global.dbFallback) {
      return res.json({ success: true, data: demo.settings });
    }

    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSettings = async (req, res) => {
  const { phone, whatsapp, instagram, facebook, address, hours } = req.body;

  try {
    if (global.dbFallback) {
      if (phone !== undefined) demo.settings.phone = phone;
      if (whatsapp !== undefined) demo.settings.whatsapp = whatsapp;
      if (instagram !== undefined) demo.settings.instagram = instagram;
      if (facebook !== undefined) demo.settings.facebook = facebook;
      if (address !== undefined) demo.settings.address = address;
      if (hours !== undefined) demo.settings.hours = hours;
      return res.json({ success: true, message: 'Settings updated successfully (Demo Mode)', data: demo.settings });
    }

    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings({});
    }

    if (phone !== undefined) settings.phone = phone;
    if (whatsapp !== undefined) settings.whatsapp = whatsapp;
    if (instagram !== undefined) settings.instagram = instagram;
    if (facebook !== undefined) settings.facebook = facebook;
    if (address !== undefined) settings.address = address;
    if (hours !== undefined) settings.hours = hours;

    await settings.save();
    res.json({ success: true, message: 'Settings updated successfully', data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSettings, updateSettings };
