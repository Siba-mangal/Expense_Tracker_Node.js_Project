const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./util/database");
const User = require("./models/signUpUser");
const { validationResult } = require("express-validator");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/user/signup", (req, res, next) => {
//   res.sendFile(__dirname + "/views/index.html");
// });

app.post("/user/signup", async (req, res, next) => {
  try {
    const UserName = req.body.name;
    const Email = req.body.email;
    const PassWord = req.body.password;

    User.findOne({ email: Email }).then(async (user) => {
      if (user) {
        return res.status(404);
      } else {
        const data = await User.create({
          username: UserName,
          email: Email,
          password: PassWord,
        });
        res.status(201).json({ UserDetail: data });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/user/getData", async (req, res, next) => {
  const users = await User.findAll();
  res.status(200).json({ allUsers: users });
});

sequelize
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
