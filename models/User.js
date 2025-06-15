const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true ,default: 'admin' },
  phone: { type: String, required: true, unique: true },
  password: { type: String ,required: false,},
  otp: { type: String },
  otpExpires: { type: Date },
  isPhoneVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
