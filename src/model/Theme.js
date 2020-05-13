const mongoose = require("mongoose");

const Theme = new mongoose.Schema(
  {
    theme: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Theme", Theme);
