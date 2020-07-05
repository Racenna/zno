const mongoose = require("mongoose");

const Theory = mongoose.Schema(
  {
    theme: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    files: {
      type: [String],
      required: false,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Theorys", Theory);
