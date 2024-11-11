const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: Buffer, required: false },
  currency: { type: String, default: "USD" },
});

module.exports = mongoose.model("User", UserSchema);
