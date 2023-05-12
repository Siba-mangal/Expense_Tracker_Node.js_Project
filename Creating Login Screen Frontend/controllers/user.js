const { User } = require("../models/signUpUser");

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
      where: { email: email, password: password },
    });

    if (user.email == email && user.password == password) {
      return res.status(201).json({ msg: "Login Successfully" });
    } else {
      // if (user.password != password) {
      //   console.log("Password is incorrect");
      //   // return res.status(202).json({ err: "password incorrect" });
      // } else {
      //   return res.status(203).json({ err: "email does not exits" });
      // }
    }
  } catch (err) {
    console.log(err);
  }
};
