const uuid = require("uuid");
const Sib = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/userModel");
const ForgotPassword = require("../models/forgotPassword");

exports.forgotPassword = async (req, res) => {
  try {
    const data = req.body.emailId;
    const user = await User.findOne({ where: { email: data } });
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.API_KEY;
    console.log(process.env.API_KEY);
    // const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: "sibaprasadmangal48@gmail.com",
    };
    const receivers = [
      {
        email: data,
      },
    ];
    if (user) {
      const id = uuid.v4();
      console.log(user.id);
      await ForgotPassword.create({
        id,
        active: true,
        signupId: user.id,
      });

      new Sib.TransactionalEmailsApi()
        .sendTransacEmail({
          sender,
          to: receivers,
          subject: "Reset Password",
          textContent: "Send a reset password mail",
          htmlContent: `<a href="http://localhost:3000/password/resetPassword/${id}">Reset password</a>`,
        })
        .then((response) => {
          return res.status(200).json({ message: "Message send successfully" });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    // console.log("Resetting password");
    const id = req.params.id;
    ForgotPassword.findOne({ where: { id: id } }).then((request) => {
      if (request) {
        request.update({ active: false });
        res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
        res.end();
      }
    });
  } catch (error) {
    console.log("Something went wrong");
  }
};

exports.updatePassword = (req, res) => {
  try {
    let newPassword = req.query;
    newPassword = newPassword.toString();
    console.log(newPassword);
    const resetPasswordId = req.params;
    console.log(resetPasswordId);
    ForgotPassword.findOne({ where: { id: resetPasswordId.id } }).then(
      (request) => {
        User.findOne({ where: { id: request.signupId } }).then(async (user) => {
          if (user) {
            // console.log(user);
            // const salt = await bcrypt.genSalt(10);
            // console.log("salt:", salt);
            // const hashPassword = await bcrypt.hash(newPassword, salt);
            // console.log("hashPassword:", hashPassword);
            // console.log(hashPassword);
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, function (err, salt) {
              if (err) {
                console.log(err);
                throw new Error(err);
              }
              bcrypt.hash(newPassword, salt, async function (err, hash) {
                if (err) {
                  console.log(err);
                  throw new Error(err);
                }
                await user.update({ password: hash }).then(() => {
                  res.status(201).json({
                    msg: "Successfuly update the new password",
                  });
                });
              });
            });
          } else {
            return res
              .status(404)
              .json({ error: "No user Exists", success: false });
          }
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error, success: false });
  }
};
