const express = require("express");
const path = require("path");

const expenseController = require("../controllers/expense");
const userAuthentication = require("../middleware/auth");

const router = express.Router();

router.post(
  "/add-expense",
  userAuthentication.authenticate,
  expenseController.addExpense
);
router.get(
  "/get-expense",
  userAuthentication.authenticate,
  expenseController.getExpense
);
router.delete(
  "/delete-expense/:UserId",
  userAuthentication.authenticate,
  expenseController.deleteExpense
);

module.exports = router;
