const mongoose = require("mongoose");
const config = require("../config");

mongoose
  .connect(
    `mongodb+srv://${config.dbuser}:${config.dbpass}@cluster0.ugltr.mongodb.net/${config.dbname}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("db connected");
  })
  .catch((ex) => {
    console.log("db connection failed: ", ex);
  });
