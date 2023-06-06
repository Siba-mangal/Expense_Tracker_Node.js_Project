const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./util/database");

const Users = require("./models/userModel");
const Expenses = require("./models/expense");
const Order = require("./models/Order");
const reset = require("./models/forgotPassword");

const userRoute = require("./route/user");
const expenseRoute = require("./route/expense");
const purchaseRoutes = require("./route/purchase");
const premiumRoute = require("./route/premium");
const forgotPassword = require("./route/forgotPassword");

const app = express();
const dotenv = require("dotenv");

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRoute);
app.use("/expense", expenseRoute);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoute);
app.use("/password", forgotPassword);

Users.hasMany(Expenses);
Expenses.belongsTo(Users);

Users.hasMany(Order);
Order.belongsTo(Users);

Users.hasMany(reset);
reset.belongsTo(Users);

sequelize
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
