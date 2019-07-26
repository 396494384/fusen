const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema({
  msg_type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  site: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date:{
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model("Message", MessageSchema);