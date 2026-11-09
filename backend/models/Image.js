const mongoose = require('mongoose');

// Uploaded photos live in MongoDB because Render's free disk is wiped on every deploy.
const imageSchema = new mongoose.Schema(
  {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    width: Number,
    height: Number,
    bytes: Number,
    originalName: { type: String, maxlength: 200 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Image', imageSchema);
