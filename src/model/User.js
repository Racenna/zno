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
    fathername: {
      type: String,
      required: true,
      min: 3,
      max: 255
    },
    group: {
      type: String
    },
    status: {
      type: String,
      require: true
    },
    verifyed: {
      type: Boolean,
      default: false
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
