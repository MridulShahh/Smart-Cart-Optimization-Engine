const Cart = require("../models/Cart");
const Product = require("../models/Product");

// helper to recalculate totals
const calcTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalItems, totalPrice };
};

// GET /api/cart/:userId
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate("items.product", "name category price rating");

    if (!cart) return res.status(404).json({ success: false, error: "Cart not found" });

    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/cart/:userId/add
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // check product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });

    // check stock
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, error: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      // create new cart
      cart = new Cart({
        userId: req.params.userId,
        items: [{ product: productId, quantity, price: product.price }]
      });
    } else {
      // check if product already in cart
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price: product.price });
      }
    }

    // update totals
    const { totalItems, totalPrice } = calcTotals(cart.items);
    cart.totalItems = totalItems;
    cart.totalPrice = totalPrice;

    // update product popularity
    await Product.findByIdAndUpdate(productId, { $inc: { popularity: 1 } });

    await cart.save();
    cart = await Cart.findOne({ userId: req.params.userId }).populate("items.product", "name category price rating");

    res.status(201).json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/cart/:userId/update
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ success: false, error: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ success: false, error: "Cart not found" });

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) return res.status(404).json({ success: false, error: "Item not in cart" });

    item.quantity = quantity;

    const { totalItems, totalPrice } = calcTotals(cart.items);
    cart.totalItems = totalItems;
    cart.totalPrice = totalPrice;

    await cart.save();
    cart = await Cart.findOne({ userId: req.params.userId }).populate("items.product", "name category price rating");

    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/cart/:userId/remove/:productId
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ success: false, error: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    const { totalItems, totalPrice } = calcTotals(cart.items);
    cart.totalItems = totalItems;
    cart.totalPrice = totalPrice;

    await cart.save();

    res.json({ success: true, message: "Item removed", data: cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/cart/:userId/clear
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ success: false, error: "Cart not found" });

    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;

    await cart.save();

    res.json({ success: true, message: "Cart cleared", data: cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};