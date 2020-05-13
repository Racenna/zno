const mongoose = require("mongoose");

const testStatistics = new mongoose.Schema(
  {
    user: {
      type: Object,
      required: true,
    },
    test: {
      type: Object,
      required: true,
    },
    testID: {
      type: mongoose.Types.ObjectId,
      ref: "Tests",
      required: true,
    },
    questions: {
      type: Array,
      required: true,
    },
    userID: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
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
