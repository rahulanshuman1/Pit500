const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    // Always a bcrypt hash. Never store or return plain text.
    password: { type: String, required: true },
  },
  { timestamps: true }
);

adminSchema.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

adminSchema.statics.hashPassword = function (plain) {
  return bcrypt.hash(plain, 12);
};

module.exports = mongoose.model('Admin', adminSchema);
