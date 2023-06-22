const expense = require("../models/expense");
const User = require("../models/userModel");
const sequelize = require("../util/database");

const fs = require("fs");
const json2csv = require("json2csv");
const UserServices = require("../services/userservices");
const S3services = require("../services/S3services");
const dotenv = require("dotenv");
const { Result } = require("express-validator");
dotenv.config();

exports.addExpense = async function (req, res, next) {
  const t = await sequelize.transaction();
  try {
    if (!req.body.category) {
      console.error("Please enter a category");
    }
    const price = req.body.price;
    const product = req.body.productName;
    const category = req.body.category;
    console.log(req.user.id);

    await expense.create(
      {
        price: price,
        productName: product,
        category: category,
        signupId: req.user.id,
      },
      { transaction: t }
    );

    const total_expense = Number(req.user.total_expenses) + Number(price);
    await User.update(
      { total_expenses: total_expense },
      {
        where: { id: req.user.id },
        transaction: t,
      }
    );
    await t.commit();
    res.status(201).json({ expense });
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
};

exports.getExpense = async (req, res, next) => {
  try {
    const limit_per_page = parseInt(req.query.param2);
    const pageNo = req.query.param1;
    const data = expense
      .count({ where: { signupId: req.user.id } })
      .then(async (data) => {
        const expenseData = await expense.findAll({
          where: { signupId: req.user.id },
          offset: (pageNo - 1) * limit_per_page,
          limit: limit_per_page,
        });

        if (
          expenseData.length > 0 &&
          expenseData !== null &&
          expenseData !== undefined
        ) {
          res.status(201).json({
            success: true,
            msg: "Get data successfully",
            expenseData,
            ispremiumuser: req.user.ispremium,
            currentPage: pageNo,
            hasNextPage: limit_per_page * pageNo < data,
            nextPage: parseInt(pageNo) + 1,
            hasPreviousPage: pageNo > 1,
            previousPage: pageNo - 1,
            lastPage: Math.ceil(data / limit_per_page),
            limit_per_page,
          });
        } else if (expenseData.length === 0) {
          res.status(200).json({
            success: false,
            msg: "No Record Found",
            expenseData,
            ispremiumuser: req.user.ispremium,
          });
        }
      });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  const expense_id = req.params.UserId;
  const cato = await expense.findOne({ where: { id: expense_id } });
  console.log(cato.price);
  const deleteUserExpense = await User.findOne({
    where: { id: cato.signupId },
  });
  // console.log(deleteUserExpense.total_expenses);
  try {
    await expense.destroy({ where: { id: expense_id, signupId: req.user.id } });
    await User.update(
      { total_expenses: deleteUserExpense.total_expenses - cato.price },
      { where: { id: req.user.id } }
    );
    return res.status(201).json({ category: cato.category, id: cato.id });
  } catch (err) {
    console.log(err);
    return res.status(403).json({ success: true, message: "Failed" });
  }
};

exports.downloadExpenses = async (req, res) => {
  try {
    const expenses = await UserServices.getExpenses(req);
    // console.log(expenses);
    const useId = req.user.id;
    const StringifyExpense = JSON.stringify(expenses);
    const filename = `Expense${useId}/${new Date()}.csv`;
    const fileURL = await S3services.uploadToS3(StringifyExpense, filename);
    res.status(201).json({ fileURL, success: true });
  } catch (err) {
    console.log(err);
  }
};
