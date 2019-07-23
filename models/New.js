const mongoose = require('mongoose');
const NewSchema = new mongoose.Schema({
  type:{
    type: String,
    required: true
  },
  title:{
    type: String,
    required: true
  },
  img:{
    type: String,
    required: true
  },
  date:{
    type: String,
    required: true
  },
  abstract:{
    type: String,
    required: true
  },
  content:{
    type: String,
    required: true
  },
  status:{
    type: Boolean,
    required: true
  }
})

module.exports = mongoose.model('New', NewSchema)