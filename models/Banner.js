const mongoose = require('mongoose')
const BannerSchema = new mongoose.Schema({
  banner:{
    type:String,
    required: true
  },
  url:{
    type:String
  },
  status:{
    type: Boolean,
    required: true
  }
})

module.exports = mongoose.model('Banner', BannerSchema)