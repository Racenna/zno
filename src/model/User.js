const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      min: 3,
      max: 255,
    },
    lastname: {
      type: String,
      required: true,
      min: 3,
      max: 255,
    },
    fathername: {
      type: String,
      required: true,
      min: 3,
      max: 255,
    },
    image: {
      type: String,
      default: "",
    },
    group: {
      type: String,
    },
    status: {
      type: String,
      require: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    activateAccount: {
      type: Boolean,
      required: true,
      default: false,
    },

    // For expiring JWTs
    sessions: {
      type: Array,
      required: true,
      default: [],
    },

    // Password resets
    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordTokenExpires: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Users", usersSchema);
