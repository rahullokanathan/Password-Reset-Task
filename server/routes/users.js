const express = require("express");
const nodemailer = require("nodemailer");
const _ = require("lodash");
const router = express.Router();
const {
  hashing,
  hashCompare,
  createJWT,
  createJWTForReset,
  verifyToken,
} = require("../library/auth");
const User = require("../models/user");

//Sign-up functionality
router.post("/signup", (req, res) => {
  const { email } = req.body;
  try {
    User.findOne({ email }).exec(async (err, user) => {
      if (user) {
        return res.json({ error: "user already exist." });
      }
      const hash = await hashing(req.body.password);
      req.body.password = hash;
      let newuser = new User(req.body);
      newuser.save((err, success) => {
        if (err) {
          console.log("Error in signup: ", err);
          return res.json({ error: err });
        }
        return res.json({
          message: "Signup successful!",
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Login functionality
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    User.findOne({ email }).exec(async (err, user) => {
      if (user) {
        const compare = await hashCompare(password, user.password);
        console.log(compare);
        if (compare) {
          const token = await createJWT({
            email,
            id: user._id,
          });
          return res.status(200).json({
            token,
            message: "Login Success",
          });
        } else {
          console.log("hiii");
          return res.json({
            message: "Wrong Password",
          });
        }
      } else {
        return res.json({
          message: "No User Available",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Forget password functionality
router.put("/forget-password", (req, res) => {
  const { email } = req.body;
  try {
    User.findOne({ email }).exec(async (err, user) => {
      if (!user || err) {
        return res.json({
          message: "User with this email does not exist",
        });
      } else {
        const token = await createJWTForReset({
          id: user._id,
        });

        return user.updateOne({ resetLink: token }, async (err, success) => {
          if (err) {
            return res.json({
              error: "Reset password link error",
            });
          } else {
            let transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "project.testing009@gmail.com",
                pass: process.env.PASSWORD,
              },
            });

            let mailOptions = {
              from: `PG <noreply@pg.com>`,
              to: email,
              subject: "Password Reset Link",
              html: `
                <h2>Please click on the below link to reset your password</h2>
                <a target="_blank" href="${process.env.CLIENT_URL}/reset-password/${token}">${process.env.CLIENT_URL}/reset-password/${token}</a>
              `,
            };

            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                console.log(err);
              } else {
                return res.json({
                  message: "Email has been sent, kindly follow the istructions",
                });
              }
            });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Reset password functionality
router.put("/reset-password", verifyToken, async (req, res) => {
  const { newPass, resetLink } = req.body;
  User.findOne({ resetLink }, async (err, user) => {
    if (err || !user) {
      return res.json({ error: "User with this token doesn't exist" });
    } else {
      const hash = await hashing(newPass);
      const obj = {
        password: hash,
        resetLink: "",
      };
      user = _.extend(user, obj);
      user.save((err, result) => {
        if (err) {
          return res.json({ error: "Resset passoward error" });
        } else {
          return res
            .status(200)
            .json({ message: "Your password has been changed" });
        }
      });
    }
  });
});

module.exports = router;
