// config/db.js

const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect(process.env.MONGO_URI || "your_mongo_connection_string", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

module.exports = { connect };
