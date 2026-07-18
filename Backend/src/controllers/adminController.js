const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Category = require('../models/Category');
const Brand = require('../models/Brand');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalOrders = await Order.countDocuments();
    
    const orders = await Order.find({ isPaid: true });
    const totalRevenue = orders.reduce((acc, item) => acc + item.totalAmount, 0);

    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalBrands = await Brand.countDocuments();

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalRevenue,
        totalProducts,
        totalCategories,
        totalBrands,
        recentOrders
      }
    });
  } catch (err) {
    next(err);
  }
};
