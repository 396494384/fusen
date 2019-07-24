const mongoose = require('mongoose');
const NewSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  abstract:{ //摘要
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