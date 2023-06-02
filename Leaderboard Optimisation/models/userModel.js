const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const User = sequelize.define("signup", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  username: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ispremiumuser: Sequelize.BOOLEAN,
});

module.exports = User;
