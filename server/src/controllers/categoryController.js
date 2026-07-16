const Category = require('../models/Category');
const Product = require('../models/Product');

const getCategories = async (req, res) => {
  try {
    if (global.dbFallback) {
      return res.json({ success: true, data: demo.categories });
    }
    const categories = await Category.find({});
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCategory = async (req, res) => {
  const { name, coverImage } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Please provide a category name' });
  }

  try {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (global.dbFallback) {
      const categoryExists = demo.categories.find(c => c.slug === slug);
      if (categoryExists) {
        return res.status(400).json({ success: false, message: 'Category already exists' });
      }

      const newCategory = {
        _id: 'cat_' + Date.now(),
        name,
        slug,
        coverImage: coverImage || '',
      };
      demo.categories.push(newCategory);
      return res.status(201).json({ success: true, data: newCategory });
    }

    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      slug,
      coverImage: coverImage || '',
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (global.dbFallback) {
      const associatedProducts = demo.products.filter(p => p.category && p.category._id === categoryId).length;
      if (associatedProducts > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete category. There are ${associatedProducts} products associated with it.`,
        });
      }

      const index = demo.categories.findIndex(c => c._id === categoryId);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      demo.categories.splice(index, 1);
      return res.json({ success: true, message: 'Category removed successfully' });
    }

    const associatedProducts = await Product.countDocuments({ category: categoryId });
    if (associatedProducts > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. There are ${associatedProducts} products associated with it.`,
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await Category.deleteOne({ _id: categoryId });
    res.json({ success: true, message: 'Category removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCategories, createCategory, deleteCategory };
