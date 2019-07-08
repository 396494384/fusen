const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
  name: String,
  number: {
    type: Number,
    default: 0
  }
})
module.exports = mongoose.model('Category', CategorySchema);