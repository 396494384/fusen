const mongoose = require("mongoose");
const CitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  number:{
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('City', CitySchema)