const mongoose = require("mongoose");

const HashedCodeSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
      require: true,
    },
    owner: { type: mongoose.Types.ObjectId, ref: "Users" },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("HashedCode", HashedCodeSchema);
