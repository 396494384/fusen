const mongoose = require('mongoose')
const PublicSchema = new mongoose.Schema({
  name: {
    type: String
  },
  logo: {
    type: String
  },
  keyword: {
    type: String
  },
  desc: {
    type: String
  },
  hotline: {
    type: String
  },
  tmall: {
    type: String
  },
  en: {
    type: String
  },
  copyright: {
    type: String
  }
})
module.exports = mongoose.model('Public', PublicSchema)