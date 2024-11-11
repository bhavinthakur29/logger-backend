const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Failed to fetch profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, currency } = req.body;
    await User.findByIdAndUpdate(req.userId, { name, currency });
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Failed to update profile" });
  }
};
