const mongoose = require("mongoose");

const Theory = mongoose.Schema({
  theme: String,
  text: String,
  tests: Array
});

module.exports = mongoose.model("Theorys", Theory);
