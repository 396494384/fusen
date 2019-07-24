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
})
module.exports = mongoose.model('Public', PublicSchema)