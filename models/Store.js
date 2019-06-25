const mongoose = require('mongoose');
const StoreSchema = new mongoose.Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City"
  },
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  worktime: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Store', StoreSchema)