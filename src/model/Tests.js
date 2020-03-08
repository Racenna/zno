const mongoose = require("mongoose");

const Tests = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    theme: {
      type: String
      // required: true
    },
    questions: [
      {
        theme: String,
        questionType: String,
        images: {
          type: [String],
          validate: [arrayLimit, "{PATH} exceeds the limit of 3"]
        },
        text: String,
        variants: [String],
        correct: [String]
      }
    ],
    owner: { type: mongoose.Types.ObjectId, ref: "User" }
  },
  {
    versionKey: false
  }
);

function arrayLimit(val) {
  return val.length <= 3;
}

module.exports = mongoose.model("Tests", Tests);
