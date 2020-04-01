const mongoose = require("mongoose");

const questionsStatistic = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Types.ObjectId,
      ref: "Users"
    },
    testID: {
      type: mongoose.Types.ObjectId,
      ref: "Tests"
    },
    questionID: {
      type: mongoose.Types.ObjectId,
      ref: "Tests"
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
