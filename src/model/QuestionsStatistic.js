const mongoose = require("mongoose");

const questionsStatistic = new mongoose.Schema(
  {
    user: {
      type: Object,
      required: true,
    },
    userID: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    testID: {
      type: mongoose.Types.ObjectId,
      ref: "Tests",
      required: true,
    },
    questionID: {
      type: mongoose.Types.ObjectId,
      ref: "Tests",
      required: true,
    },
    result: {
      type: Boolean,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("QuestionsStatistic", questionsStatistic);
