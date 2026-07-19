const Product = require('../models/Product');
const slugify = require('slugify');

const Category = require('../models/Category');

// GET all products with filtering, sorting, pagination
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, brand, search, sort, page = 1, limit = 12, isFeatured } = req.query;
    let filter = { isActive: true };

    if (category) {
      // If it's a valid ObjectId, use it directly
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        filter.category = category;
      } else {
        // Find category by name or slug
        const cat = await Category.findOne({
          $or: [
            { name: { $regex: new RegExp(`^${category}$`, 'i') } },
            { slug: { $regex: new RegExp(`^${category}$`, 'i') } }
          ]
        });
        if (cat) filter.category = cat._id;
        else filter.category = null; // force empty result if category doesn't exist
      }
    }
    
    if (brand) filter.brand = brand;
    if (isFeatured) filter.isFeatured = isFeatured === 'true';

    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };
    if (sort === 'popularity') sortObj = { popularity: -1 };

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({ 
      success: true, 
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: products 
    });
  } catch (err) {
    next(err);
  }
};

// GET single product by ID or Slug
exports.getProduct = async (req, res, next) => {
  try {
    const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const filter = isObjectId ? { _id: req.params.id } : { slug: req.params.id };

    const product = await Product.findOne(filter)
      .populate('category', 'name slug')
      .populate('brand', 'name slug');
      
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// POST create new product
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// PUT update product
exports.updateProduct = async (req, res, next) => {
  try {
    // If name is updated, slugify it
    if (req.body.productName) {
      req.body.slug = slugify(req.body.productName, { lower: true, strict: true });
      req.body.name = req.body.productName;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// DELETE product
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};