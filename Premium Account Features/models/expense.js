const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const expense = sequelize.define("Expense", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  productName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
module.exports = expense;
