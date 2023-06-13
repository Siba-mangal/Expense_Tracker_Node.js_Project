const expense = require("../models/expense");
const User = require("../models/userModel");
const sequelize = require("../util/database");
const AWS = require("aws-sdk");

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

function uploadToS3(data, filename) {
  const BUCKET_NAME = "expense23";
  const IAM_USER_KEY = "AKIAUFUSMQT6QPTPEFUO";
  const IAM_USER_SECRET = "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";

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    // Bucket: BUCKET_NAME
  });
  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, res) => {
      if (err) {
        console.log("Something went wrong");
        reject(err);
      } else {
        console.log("Success", res);
        resolve(res.Location);
      }
    });
  });
}
exports.downloadExpenses = async (req, res) => {
  try {
    const expenses = await req.user.getExpenses();
    console.log(expenses);
    const useId = req.user.id;
    const StringifyExpense = JSON.stringify(expenses);
    const filename = `Expense${useId}/${new Date()}.txt`;
    const fileURL = await uploadToS3(StringifyExpense, filename);
    res.status(201).json({ fileURL, success: true });
  } catch (err) {
    console.log(err);
  }
};
