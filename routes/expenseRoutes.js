const express = require("express");
const {
  createExpense,
  getExpenses,
  deleteExpense,
} = require("../controllers/expenseController");
const authenticate = require("../middleware/authenticate");
const router = express.Router();

router.post("/", authenticate, createExpense);
router.get("/", authenticate, getExpenses);
router.delete("/:id", authenticate, deleteExpense);

module.exports = router;
