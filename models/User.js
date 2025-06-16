const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },
  isPhoneVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
