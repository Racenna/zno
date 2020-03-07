const mongoose = require("mongoose");

const Tests = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    theme: {
      type: String,
      required: true
    },
    questions: [
      {
        theme: String,
        text: String,
        variants: [String],
        correct: String
      }
    ],
    owner: { type: mongoose.Types.ObjectId, ref: "User" }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("Tests", Tests);
