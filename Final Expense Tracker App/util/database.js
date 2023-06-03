const Sequelize = require("sequelize");
const sequelize = new Sequelize("user-signup", "root", "Siba@2518", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
