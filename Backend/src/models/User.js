const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
{
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ["customer", "admin", "superadmin"], default: "customer" },
  avatar: { type: String, default: "" },
  preferredBrand: { type: String },
  shippingPreference: { type: String, enum: ["standard", "express"], default: "standard" },
  
  // Auth additions
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  refreshToken: { type: String },

  // E-commerce additions
  addresses: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: { type: Boolean, default: false }
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
},
{
  timestamps: true
}
);

module.exports = mongoose.model("User", UserSchema);