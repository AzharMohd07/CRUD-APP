const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/product-master", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Database connection failed");
    console.log(err);
  });

module.exports = mongoose;
