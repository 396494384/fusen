const mongoose = require('mongoose');
const NewSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  date:{
    type: String,
    required: true
  },
  content:{
    type: String,
    required: true
  }
})

module.exports = mongoose.model('NewSchema', New)