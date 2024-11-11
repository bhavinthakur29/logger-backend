const Expense = require("../models/Expense");

exports.createExpense = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const expense = new Expense({ user: req.userId, amount, description });
    await expense.save();
    res.status(201).json({ success: true, expense });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to add expense" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId }).sort({
      date: -1,
    });
    res.json({ success: true, expenses });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Failed to fetch expenses" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Failed to delete expense" });
  }
};
