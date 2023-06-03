const Sequelize = require("sequelize");

const sequelize = new Sequelize("user-data", "root", "Siba@2518", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
