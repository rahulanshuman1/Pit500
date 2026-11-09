const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, default: '', trim: true, maxlength: 400 },
    imagePlaceholderUrl: { type: String, default: '', trim: true, maxlength: 2048 },
  },
  { _id: false }
);

const contentSchema = new mongoose.Schema(
  {
    // Fixed key so the collection can only ever hold one site-content document.
    key: { type: String, default: 'site', unique: true, immutable: true },
    heroHeadline: { type: String, required: true, trim: true, maxlength: 160 },
    heroSubheadline: { type: String, default: '', trim: true, maxlength: 400 },
    storeAddress: { type: String, default: '', trim: true, maxlength: 300 },
    storeTimings: { type: String, default: '', trim: true, maxlength: 200 },
    whatsappNumber: { type: String, default: '', trim: true, maxlength: 20 },
    categories: { type: [categorySchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Content', contentSchema);
