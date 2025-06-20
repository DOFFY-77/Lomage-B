const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  currency: { type: String, required: true }, // e.g., 'RS'
  category: { type: String, required: true }, // Arabic categories
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  images: [{ type: String }], // base64 or URLs, up to 10
  isSold: { type: Boolean, default: false },
  isReceived: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema); 