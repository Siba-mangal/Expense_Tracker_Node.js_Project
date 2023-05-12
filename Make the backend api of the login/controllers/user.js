const { User } = require("../models/userModel");

exports.signUp = async (req, res, next) => {
  const UserName = req.body.name;
  const Email = req.body.email;
  const PassWord = req.body.password;
  const user = await User.findOne({ where: { email: Email } });
  try {
    if (user) {
      return res.status(201).json({ err: "email already exits" });
    } else {
      User.create({
        username: UserName,
        email: Email,
        password: PassWord,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.Email;
    const password = req.body.Password;

    const user = await User.findOne({
      where: { email: email },
    });

    if (user) {
      if (user.password != password) {
        return res.status(401).json({ msg: "User not authorized" });
        // return res.status(401);
      } else {
        return res.status(201).json({ msg: "login successfully" });
      }
    } else {
      return res.status(404).json({ msg: "User does not exits" });
    }
  } catch (err) {
    console.log(err);
  }
};
