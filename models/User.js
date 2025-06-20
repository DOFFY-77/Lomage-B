const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: false },
  name: { type: String },
  phone: { type: String, unique: true },
  image: { type: String }, // base64 or URL
  purchasesIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  forSaleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  password: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },
  isPhoneVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
