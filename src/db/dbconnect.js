const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

async function connectedMongoDB() {
  await mongoose
    .connect(
      process.env.DB_CONNECT,
      // `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${process.env.MONGO_URL}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )
    .then(() => console.log("connected to db"))
    .catch(err => console.log(err));
}

module.exports = connectedMongoDB;
