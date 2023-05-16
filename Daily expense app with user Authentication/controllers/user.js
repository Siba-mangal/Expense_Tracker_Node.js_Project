const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//using bcrypt for password form of hashing
exports.signUp = async function (req, res, next) {
  try {
    const UserName = req.body.name;
    const Email = req.body.email;
    const PassWord = req.body.password;
    const user = await User.findOne({ where: { email: Email } });
    if (user) {
      return res.status(201).json({ err: "email already exits" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(PassWord, salt);
      console.log(hashPassword);
      User.create({
        username: UserName,
        email: Email,
        password: hashPassword,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const generateAccessToken = (id, name) => {
  return jwt.sign({ signupId: id, username: name }, "secretkey");
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.Email;
    const password = req.body.Password;
    const user = await User.findOne({
      where: { email: email },
    });
    if (user) {
      const isMatch = bcrypt.compare(password, user.password);
      if (isMatch) {
        // console.log(user.id);
        return res.status(201).json({
          msg: "login successfully",
          token: generateAccessToken(user.id, user.username),
        });
      } else {
        return res.status(401).json({ msg: "User not authorized" });
      }
    } else {
      return res.status(404).json({ msg: "User does not exits" });
    }
  } catch (err) {
    console.log(err);
  }
};
