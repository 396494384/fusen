const mongoose = require('mongoose')
const PublicSchema = new mongoose.Schema({
  name: String,
  logo: String,
  keyword: String,
  desc: String,
  hotline: String,
  qq: String,
  tmall: String,
  en: String,
  copyright: String,
  video: String,
  video_img: String,
  video_status: {
    type: Boolean,
    default: true
  }
})
module.exports = mongoose.model('Public', PublicSchema)