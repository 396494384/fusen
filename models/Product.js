const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  name: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  product_img: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  voltage: String,
  energy: String,
  volume: String,
  function: String,
  specifications: String,
  url: {
    type: String,
    required: true
  },
  imgs: {
    type: Array,
    required: true
  },
  status: Boolean
})

module.exports = mongoose.model('Product', ProductSchema);