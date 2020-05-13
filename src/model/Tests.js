const mongoose = require("mongoose");

const Tests = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
    questions: [
      {
        theme: {
          type: String,
          required: true,
        },
        questionType: {
          type: String,
          required: true,
        },
        images: {
          type: [String],
          validate: [arrayLimit, "{PATH} exceeds the limit of 3"],
        },
        text: {
          type: String,
          required: true,
        },
        variants: {
          type: [String],
          required: true,
        },
        correct: {
          type: [String],
          required: true,
        },
      },
    ],
    owner: { type: mongoose.Types.ObjectId, ref: "Users" },
  },
  {
    versionKey: false,
  }
);

function arrayLimit(val) {
  return val.length <= 3;
}

module.exports = mongoose.model("Tests", Tests);
