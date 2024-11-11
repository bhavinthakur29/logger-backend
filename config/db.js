// config/db.js

const mongoose = require("mongoose");

const connect = () => {
  const mongoURI = process.env.MONGO_URI; // Get URI from environment variables
  if (!mongoURI) {
    console.error("MONGO_URI is not defined in the .env file");
    return;
  }

  mongoose
    .connect(mongoURI, {
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
