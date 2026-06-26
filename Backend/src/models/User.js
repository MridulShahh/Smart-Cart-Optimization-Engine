const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
{
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer"
  },
  avatar: {
    type: String,
    default: ""
  },
  preferredBrand: {
    type: String
  },
  shippingPreference: {
    type: String,
    enum: ["standard", "express"],
    default: "standard"
  }
},
{
  timestamps: true
}
);

module.exports = mongoose.model("User", UserSchema);