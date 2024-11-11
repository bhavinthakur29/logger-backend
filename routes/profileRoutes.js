const express = require("express");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");
const authenticate = require("../middleware/authenticate");
const router = express.Router();

router.get("/", authenticate, getProfile);
router.put("/", authenticate, updateProfile);

module.exports = router;
