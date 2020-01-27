const mongoose = require("mongoose");

const questionsStatistic = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    ot: {
      type: String,
      required: true
    },
    group: {
      type: String,
      required: true
    },
    questionID: {
      type: String,
      required: true
    },
    result: {
      type: Boolean,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("QuestionsStatistic", questionsStatistic);
