const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 255
    },
    email: {
      type: String,
      required: true,
      min: 5,
      max: 255
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 1024
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("Users", usersSchema);
