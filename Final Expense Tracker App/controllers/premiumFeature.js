const User = require("../models/userModel");
const Expense = require("../models/expense");
const sequelize = require("../util/database");
const e = require("express");

exports.getUserLeaderBoard = async (req, res) => {
  try {
    const leaderboardofusers = await User.findAll({
      attributes: [
        "id",
        "username",
        [sequelize.fn("sum", sequelize.col("expenses.price")), "total_cost"],
      ],
      include: [
        {
          model: Expense,
          attributes: [],
        },
      ],
      group: ["signup.id"],
      order: [["total_cost", "DESC"]],
    });

    res.status(200).json(leaderboardofusers);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
