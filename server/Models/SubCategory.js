const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubCategorySchema = new Schema({
  sNo: { type: Number, required: true},
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
});

module.exports = mongoose.model('SubCategory', SubCategorySchema);