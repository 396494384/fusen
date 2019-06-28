const mongoose = require('mongoose');
const PartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  url: {
    type: String,
    default: ""
  },
  status: {
    type: Boolean,
    default: true
  }
})

module.exports = mongoose.model('Partner', PartnerSchema);