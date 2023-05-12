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

// function isstringinvalid(string) {
//   if (string == undefined || string.length === 0) {
//     return true;
//   } else {
//     return false;
//   }
// }
// exports.signUp = async (req, res, next) => {
//   try {
//     const UserName = req.body.name;
//     const Email = req.body.email;
//     const PassWord = req.body.password;
//     if (
//       isstringinvalid(UserName) ||
//       isstringinvalid(Email || isstringinvalid(PassWord))
//     ) {
//       return res
//         .status(400)
//         .json({ err: "Bad parameters . Something is missing" });
//     }

//   } catch (err) {
//     res.status(500).json(err);
//   }
//   //   const user = await User.findAll({ where: { email: Email } });
//   //   for (let i = 0; i < user.length; i++) {
//   //     if (user[i].email === Email) {
//   //       return res.status(400).json({ err: "email already exits" });
//   //     } else {
//   //       User.create({
//   //         username: UserName,
//   //         email: Email,
//   //         password: PassWord,
//   //       })
//   //         .then((result) => {
//   //           console.log(result);
//   //         })
//   //         .catch((e) => console.log(e));
//   //     }
//   //   }
//   // } catch (err) {
//   //   res.status(500).json(err);
//   // }
// };
