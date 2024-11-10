const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Set strictQuery option
mongoose.set("strictQuery", false);

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://bhavinthakur:loggerbybhavin@expenselogger.fgjbk.mongodb.net/?retryWrites=true&w=majority&appName=expenseLogger",
    {
      serverSelectionTimeoutMS: 5000,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// User model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: Buffer, required: false },
  currency: { type: String, default: "USD" },
});

const User = mongoose.model("User", UserSchema);

// Expense model
const ExpenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Expense = mongoose.model("Expense", ExpenseSchema);

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ message: "Authentication required" });

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Routes
app.post("/register", async (req, res) => {
  try {
    const { username, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, name });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: "Registration failed" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });
    res.json({
      token,
      userId: user._id,
      name: user.name,
      currency: user.currency,
    });
  } catch (error) {
    res.status(400).json({ message: "Login failed" });
  }
});

app.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch profile" });
  }
});

app.put("/profile", authenticate, async (req, res) => {
  try {
    const { name, currency } = req.body;
    await User.findByIdAndUpdate(req.userId, { name, currency });
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to update profile" });
  }
});

app.post("/expenses", authenticate, async (req, res) => {
  try {
    const { amount, description } = req.body;
    const expense = new Expense({ user: req.userId, amount, description });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: "Failed to add expense" });
  }
});

app.get("/expenses", authenticate, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId }).sort({
      date: -1,
    });
    res.json(expenses);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch expenses" });
  }
});

app.delete("/expenses/:id", authenticate, async (req, res) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete expense" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
