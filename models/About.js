const mongoose = require("mongoose");
AboutSchema = new mongoose.Schema({
  content: String,
  img: String
})

module.exports = mongoose.model("About", AboutSchema);