const mongoose = require('mongoose');
const { Schema } = mongoose;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  iconUrl: { type: String },
  link: { type: String },
  document: { type: Boolean, default: false },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategory', required: true },
});

module.exports = mongoose.model('Item', ItemSchema);
