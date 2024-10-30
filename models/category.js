const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  parentCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
  subCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  image: String,
  cars: [{ type: Schema.Types.ObjectId, ref: 'Car' }]
});

module.exports = mongoose.model('Category', CategorySchema);
