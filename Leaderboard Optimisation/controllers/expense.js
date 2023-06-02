const expense = require("../models/expense");
const User = require("../models/userModel");

exports.addExpense = function (req, res, next) {
  try {
    if (!req.body.category) {
      console.error("Please enter a category");
    }

    const price = req.body.price;
    const product = req.body.productName;
    const category = req.body.category;
    console.log(req.user.id);

    expense
      .create({
        price: price,
        productName: product,
        category: category,
        signupId: req.user.id,
      })
      .then((expense) => {
        const total_expense = Number(req.user.total_expenses) + Number(price);
        User.update(
          { total_expenses: total_expense },
          {
            where: { id: req.user.id },
          }
        )
          .then(async () => {
            return res.status(201).json({ expense });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch(function (err) {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

exports.getExpense = async (req, res, next) => {
  await expense
    .findAll({ where: { signupId: req.user.id } })
    .then((expense) => {
      return res.status(201).json({ expense });
    })
    .catch((err) => console.log(err));
};

exports.deleteExpense = async (req, res, next) => {
  const expense_id = req.params.UserId;
  const cato = await expense.findOne({ where: { id: expense_id } });

  expense
    .destroy({ where: { id: expense_id, signupId: req.user.id } })
    .then(() => {
      return res.status(201).json({ category: cato.category, id: cato.id });
    })
    .catch((err) => {
      console.log(err);
      return res.status(403).json({ success: true, message: "Failed" });
    });
};
