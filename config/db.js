const mongoose = require("mongoose");
require("dotenv").config();

const connect = () => {
  const mongoURI = process.env.MONGODB_URI; // Get URI from environment variables
  if (!mongoURI) {
    console.error("MONGO_URI is not defined in the .env file\n", mongoURI);
    return;
  }

  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

module.exports = { connect };
