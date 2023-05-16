const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./util/database");

const Users = require("./models/userModel");
const Expenses = require("./models/expense");

const userRoute = require("./route/user");
const expenseRoute = require("./route/expense");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRoute);
app.use("/expense", expenseRoute);

Users.hasMany(Expenses);
Expenses.belongsTo(Users);

sequelize
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
