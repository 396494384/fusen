const mongoose = require("mongoose");
const FindSchema = new mongoose.Schema({
  img: String,
  title: String,
  text: String,
  type: String
})

module.exports = mongoose.model("Find", FindSchema);