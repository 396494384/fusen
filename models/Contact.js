const mongoose = require('mongoose');
const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  postal_code: {
    type: String
  },
  email: {
    type: String
  },
  telephone: {
    type: String
  },
  join_position: {
    type: String
  },
  join_name: {
    type: String
  },
  join_email: {
    type: String
  },
  join_phone: {
    type: String
  },
  code: {
    type: String
  }
})

module.exports = mongoose.model('Contact', ContactSchema)