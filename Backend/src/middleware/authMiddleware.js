const jwt = require("jsonwebtoken");

// Verify Logged-in User
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Not authorized"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "smartcartsecret"
    );

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Invalid token"
    });
  }
};

// Verify Admin
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Admin access only"
    });
  }

  next();
};