const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  color: String,
  image: String,
  description: String,
  category: { type: Schema.Types.ObjectId, ref: 'Category' }
});

module.exports = mongoose.model('Car', CarSchema);
