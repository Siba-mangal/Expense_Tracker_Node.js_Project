const expense = require("../models/expense");
const User = require("../models/userModel");
const sequelize = require("../util/database");

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

    const expenses = await expense.create(
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
