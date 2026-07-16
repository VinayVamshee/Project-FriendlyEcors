const GalleryItem = require('../models/GalleryItem');
const { handleImageUpload } = require('../middleware/upload');

const getGalleryItems = async (req, res) => {
  try {
    const { category } = req.query;

    if (global.dbFallback) {
      let filtered = [...demo.galleryItems];
      if (category) {
        filtered = filtered.filter(i => i.category && i.category._id === category);
      }
      // Sort newest first
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      return res.json({ success: true, data: filtered });
    }

    let query = {};
    if (category) {
      query.category = category;
    }

    const items = await GalleryItem.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createGalleryItem = async (req, res) => {
  try {
    const { eventName, location, category, date, imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Please provide an image URL' });
    }

    if (global.dbFallback) {
      const matchedCategory = demo.categories.find(c => c._id === category) || { name: 'Wedding Decor', slug: 'wedding-decor' };
      const newItem = {
        _id: 'gal_' + Date.now(),
        imageUrl,
        eventName,
        location: location || 'Dallas, TX',
        category: { _id: matchedCategory._id, name: matchedCategory.name, slug: matchedCategory.slug },
        date: date ? new Date(date) : new Date(),
      };
      demo.galleryItems.push(newItem);
      return res.status(201).json({ success: true, data: newItem });
    }

    const item = await GalleryItem.create({
      imageUrl,
      eventName,
      location: location || 'Dallas, TX',
      category,
      date: date || new Date(),
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteGalleryItem = async (req, res) => {
  try {
    if (global.dbFallback) {
      const idx = demo.galleryItems.findIndex(i => i._id === req.params.id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Gallery item not found (Demo Mode)' });
      }
      demo.galleryItems.splice(idx, 1);
      return res.json({ success: true, message: 'Gallery item removed successfully' });
    }

    const item = await GalleryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    await GalleryItem.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Gallery item removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getGalleryItems, createGalleryItem, deleteGalleryItem };
