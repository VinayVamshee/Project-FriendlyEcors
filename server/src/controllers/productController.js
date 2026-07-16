const Product = require('../models/Product');
const Category = require('../models/Category');
const { handleImageUpload } = require('../middleware/upload');

const getProducts = async (req, res) => {
  try {
    const { category, featured, search } = req.query;

    if (global.dbFallback) {
      let filtered = [...demo.products];

      if (category) {
        filtered = filtered.filter(p => p.category && p.category.slug === category);
      }

      if (featured === 'true') {
        filtered = filtered.filter(p => p.featured === true);
      }

      if (search) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
      }

      return res.json({ success: true, data: filtered });
    }

    let query = {};
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        query.category = cat._id;
      } else {
        return res.json({ success: true, data: [] });
      }
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).populate('category', 'name slug');
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    if (global.dbFallback) {
      const prod = demo.products.find(p => p._id === req.params.id);
      if (!prod) {
        return res.status(404).json({ success: false, message: 'Product not found (Demo Mode)' });
      }
      return res.json({ success: true, data: prod });
    }

    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { title, description, price, duration, category, dimensions, included, featured, images } = req.body;

    let imageUrls = images || [];
    if (imageUrls.length === 0) {
      imageUrls.push('/uploads/placeholder.jpg');
    }

    const parsedIncluded = typeof included === 'string' ? JSON.parse(included) : included;

    if (global.dbFallback) {
      const matchedCategory = demo.categories.find(c => c._id === category) || { name: 'Flower Walls', slug: 'flower-walls' };
      const newProduct = {
        _id: 'prod_' + Date.now(),
        title,
        description,
        price: Number(price),
        duration: duration || 'Daily',
        images: imageUrls,
        category: { _id: matchedCategory._id, name: matchedCategory.name, slug: matchedCategory.slug },
        dimensions: dimensions || '',
        included: parsedIncluded || [],
        featured: featured === 'true' || featured === true,
      };

      demo.products.push(newProduct);
      return res.status(201).json({ success: true, data: newProduct });
    }

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      duration: duration || 'Daily',
      images: imageUrls,
      category,
      dimensions: dimensions || '',
      included: parsedIncluded || [],
      featured: featured === 'true' || featured === true,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { title, description, price, duration, category, dimensions, included, featured, images } = req.body;

    let imageUrls = images || [];
    if (imageUrls.length === 0) {
      imageUrls.push('/uploads/placeholder.jpg');
    }

    const parsedIncluded = typeof included === 'string' ? JSON.parse(included) : included;

    if (global.dbFallback) {
      const prodIndex = demo.products.findIndex(p => p._id === req.params.id);
      if (prodIndex === -1) {
        return res.status(404).json({ success: false, message: 'Product not found (Demo Mode)' });
      }

      const current = demo.products[prodIndex];
      const matchedCategory = category ? (demo.categories.find(c => c._id === category) || current.category) : current.category;

      demo.products[prodIndex] = {
        ...current,
        title: title || current.title,
        description: description || current.description,
        price: price !== undefined ? Number(price) : current.price,
        duration: duration || current.duration,
        images: imageUrls,
        category: { _id: matchedCategory._id, name: matchedCategory.name, slug: matchedCategory.slug },
        dimensions: dimensions !== undefined ? dimensions : current.dimensions,
        included: parsedIncluded || current.included,
        featured: featured !== undefined ? (featured === 'true' || featured === true) : current.featured,
      };

      return res.json({ success: true, data: demo.products[prodIndex] });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.duration = duration || product.duration;
    product.images = imageUrls;
    product.category = category || product.category;
    product.dimensions = dimensions !== undefined ? dimensions : product.dimensions;
    product.included = parsedIncluded || product.included;
    product.featured = featured !== undefined ? (featured === 'true' || featured === true) : product.featured;

    const updatedProduct = await product.save();
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    if (global.dbFallback) {
      const idx = demo.products.findIndex(p => p._id === req.params.id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Product not found (Demo Mode)' });
      }
      demo.products.splice(idx, 1);
      return res.json({ success: true, message: 'Product removed' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await Product.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
