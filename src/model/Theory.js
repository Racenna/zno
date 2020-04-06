const mongoose = require("mongoose");

const Theory = mongoose.Schema(
  {
    theme: String,
    name: String,
    image: String,
    text: String,
    tests: Array,
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Theorys", Theory);
