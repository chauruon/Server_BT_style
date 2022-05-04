const mongoose = require("mongoose");
require("dotenv/config");

async function CallAndConnectMongodb() {
  await mongoose
    .connect(process.env.CONNECT_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database Connection is ready");
    })
    .catch((err) => {
      console.trace(err);
    });
}

module.exports = CallAndConnectMongodb;
