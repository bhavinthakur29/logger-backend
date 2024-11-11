// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/authController");

router.post("/", loginUser); // Handle POST request to /login

module.exports = router;
