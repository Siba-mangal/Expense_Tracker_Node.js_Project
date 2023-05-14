const { Result } = require("express-validator");
const { expense } = require("../models/expense");

exports.addExpense = function (req, res, next) {
  try {
    if (!req.body.category) {
      console.error("Please enter a category");
    }

    const price = req.body.price;
    const product = req.body.productName;
    const category = req.body.category;

    expense
      .create({
        price: price,
        productName: product,
        category: category,
      })
      .then((expense) => {
        return res.status(201).json({ expense });
      })
      .catch(function (err) {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

exports.getExpense = async (req, res, next) => {
  expense
    .findAll()
    .then((expense) => {
      return res.status(201).json({ expense });
      // return res.status(200).json({ expense, success: true });
    })
    .catch((err) => console.log(err));
};

exports.deleteExpense = async (req, res, next) => {
  const expense_id = req.params.UserId;
  const cato = await expense.findOne({ where: { id: expense_id } });

  expense
    .destroy({ where: { id: expense_id } })
    .then(() => {
      return res.status(201).json({ category: cato.category, id: cato.id });
    })
    .catch((err) => {
      console.log(err);
      return res.status(403).json({ success: true, message: "Failed" });
    });
};
