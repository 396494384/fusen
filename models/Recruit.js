const mongoose = require('mongoose');
const RecruitSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  status:{
    type: Boolean,
    required: true
  }
})
module.exports = mongoose.model('Recruit', RecruitSchema)