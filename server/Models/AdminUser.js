const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNo: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('AdminUser', adminUserSchema);
