const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      min: 3,
      max: 255
    },
    lastname: {
      type: String,
      required: true,
      min: 3,
      max: 255
    },
    ot: {
      //fathername
      type: String,
      required: true,
      min: 3,
      max: 255
    },
    group: {
      type: String,
      required: true,
      min: 4,
      max: 4
    },
    email: {
      type: String,
      required: true,
      max: 255
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 1024
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("Users", usersSchema);
