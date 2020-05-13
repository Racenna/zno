const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    group: {
      type: [String],
      require: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Groups", groupSchema);
