const mongoose = require("mongoose");

const generalStatistic = new mongoose.Schema(
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
    testID: {
      type: String,
      required: true
    },
    result: {
      type: Number,
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

module.exports = mongoose.model("GeneralStatistic", generalStatistic);
