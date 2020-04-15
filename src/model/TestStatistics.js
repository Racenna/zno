const mongoose = require("mongoose");

const testStatistics = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    testID: {
      type: mongoose.Types.ObjectId,
      ref: "Tests",
    },
    name: {
      type: String,
      required: true,
    },
    question: Array,
    result: {
      type: Number,
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

module.exports = mongoose.model("TestStatistics", testStatistics);
