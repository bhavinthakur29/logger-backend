// server.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
db.connect();

// Middlewares
app.use(cors()); // Allow CORS
app.use(bodyParser.json()); // Parse JSON data

// Routes
app.use("/login", authRoutes); // Use the login route

// Server setup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
