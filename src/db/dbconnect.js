const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

async function connectedMongoDB() {
  await mongoose
    .connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => console.log("connected to db"))
    .catch((err) => console.log(err));
}

module.exports = connectedMongoDB;
