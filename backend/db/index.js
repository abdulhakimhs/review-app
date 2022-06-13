const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://ahsanDbUser:ahsanDbUser98@cluster0.ugltr.mongodb.net/review_app",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("db connected");
  })
  .catch((ex) => {
    console.log("db connection failed: ", ex);
  });
