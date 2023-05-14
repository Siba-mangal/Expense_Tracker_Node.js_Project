const express = require("express");
const path = require("path");

const userController = require("../controllers/user");
const expenseController = require("../controllers/expense");

const router = express.Router();

router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.post("/add-expense", expenseController.addExpense);
router.get("/get-expense", expenseController.getExpense);
router.delete("/delete-expense/:UserId", expenseController.deleteExpense);
module.exports = router;
