// package imports
require("dotenv").config();
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const uniqueString = require("unique-string");
const nodemailer = require("nodemailer");
const moment = require("moment");
const axios = require("axios");
const generateUniqueId = require("generate-unique-id");
//local imports

const Admin = require("../models/").adminuser;
const ResetPasswords = require("../models").ResetPassword;

//controllers

exports.adminLogin = (req, res, next) => {
  res.render("login");
};

exports.signUpUser = (req, res, next) => {
  res.render("signup2");
};

exports.forgotPassword = (req, res, next) => {
  //res.render("auths/login2");
  res.render("forgotpwd");
};

// create admin user
exports.createAdminUser = async (req, res, next) => {
  console.log(req.body);
  const mailformat =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      phonenumber,
      referral_email,
      confirmpassword,
    } = req.body;
    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !phonenumber ||
      !confirmpassword
    ) {
      req.flash("warning", "Please Fill all required Fields!");
      res.redirect("back");
    } else if (!email.match(mailformat)) {
      req.flash("warning", "Wrong Email Format!");
      res.redirect("back");
    } else if (password.length < 5) {
      req.flash("warning", "Password should be more than 5 characters!");
      res.redirect("back");
    } else if (password !== confirmpassword) {
      req.flash("warning", "Password does not match!");
      res.redirect("back");
    } else {
      const admin = await Admin.findOne({ where: { email } });
      if (admin) {
        req.flash("warning", "This Email already exists!");
        res.redirect("back");
      } else {
        const hashPwd = await bcrypt.hashSync(password, 10);
        const newAdmin = await Admin.create({
          firstname,
          lastname,
          phonenumber,
          email,
          password: hashPwd,
          referral_email,
        });
        req.session.adminId = newAdmin.id;
        console.log(req.session.adminId);
        req.flash("success", "Admin Created Successfully");
        res.redirect("/dashboard");
      }
    }
  } catch (err) {
    req.flash("warning", "Server Error!");
    res.redirect("back");
  }
};

exports.loginAdminUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      req.flash("error", "Please Fill all Fields!");
      res.redirect("back");
    } else {
      const admin = await Admin.findOne({ where: { email } });
      if (!admin) {
        req.flash("error", "Invalid Details!");
        res.redirect("back");
      } else {
        const compare = await bcrypt.compareSync(password, admin.password);
        if (!compare) {
          req.flash("error", "Incorrect Password!");
          res.redirect("back");
        } else {
          req.session.adminId = admin.id;
          console.log(req.session.adminId);
          req.flash("success", "LoggedIn Successfully");
          res.redirect("/dashboard");
        }
      }
    }
  } catch (err) {
    req.flash("error", "Server Error!");
    res.redirect("back");
  }
};

exports.postGetLink = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      req.flash("warning", "Please enter email");
      res.redirect("back");
    } else {
      const user = await Admin.findOne({
        where: {
          email: {
            [Op.eq]: email,
          },
        },
      });

      if (!user) {
        req.flash("warning", "Email not found");
        res.redirect("back");
      } else {
        let token = uniqueString();
        const output = `<html>
              <head>
                <title>Reset Password link for elfrique account</title>
              </head>
              <body>
              <p>You requested to change your password, please ignore If you didn't make the request</p>
              <a style="width: 100px; background: #FFA73B; color: #fff; height: 50px; padding: 12px 20px; text-decoration: none; margin-top: 30px;" href='${process.env.SITE_URL}/resetpassword?email=${email}&token=${token}'>RESET PASSWORD</a>
              </body>
        </html>`;

        let transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_USERNAME, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // generated ethereal password
          },
        });

        // send mail with defined transport object
        let mailOptions = {
          from: ` "elfrique" <${parameters.EMAIL_USERNAME}>`, // sender address
          to: `${email}`, // list of receivers
          subject: "[elfrique] Please reset your password", // Subject line
          text: "Elfrique", // plain text body
          html: output, // html body
        };

        // insert into forgot password the value of the token and email
        // if email exists already update else insert new
        const reset = await ResetPasswords.findOne({
          where: {
            user_email: {
              [Op.eq]: email,
            },
          },
        });
        if (reset) {
          const update = await ResetPasswords.update(
            {
              token: token,
            },
            {
              where: {
                user_email: {
                  [Op.eq]: email,
                },
              },
            }
          );
        } else {
          const newRes = await ResetPasswords.create({
            user_email: email,
            token: token,
            status: 0,
          });
        }

        // Send mail
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            req.flash("error", "Error sending mail");
            res.redirect("back");
          } else {
            req.flash("success", "Reset link sent to email");
            res.redirect("back");
          }
        });
      }
    }
  } catch (error) {
    req.flash("error", "Try again, something went wrong!");
    res.redirect("back");
  }
};

exports.resetPassword = (req, res, next) => {
  let email = req.query.email;
  let token = req.query.token;

  ResetPasswords.findOne({
    where: {
      [Op.and]: [
        {
          user_email: {
            [Op.eq]: email,
          },
        },
        {
          token: {
            [Op.eq]: token,
          },
        },
      ],
    },
  })
    .then((reset) => {
      if (reset) {
        // save as session the reset email and reset token
        req.session.resetEmail = email;
        req.session.resetToken = token;

        res.render("resetpassword");
      } else {
        req.flash("warning", "Invalid reset details");
        res.redirect("/");
      }
    })
    .catch((error) => {
      req.flash("error", "Server Error, try again!");
      res.redirect("/");
    });
};

exports.postResetPassword = (req, res, next) => {
  const { password, confirmpassword } = req.body;
  if (!password || confirmpassword) {
    req.flash("warning", "Enter Passwords");
    res.redirect("back");
  } else if (password != confirmpassword) {
    req.flash("warning", "Passwords must match");
    res.redirect("back");
  } else if (password.length < 6) {
    req.flash("warning", "Passwords must be greater than 5 letters");
    res.redirect("back");
  } else {
    let currentPassword = bcrypt.hashSync(password, 10);
    Users.update(
      {
        password: currentPassword,
      },
      {
        where: {
          email: {
            [Op.eq]: req.session.resetEmail,
          },
        },
      }
    )
      .then((update) => {
        req.flash("success", "Password changed successfully!");
        res.redirect("/login");
      })
      .catch((error) => {
        req.flash("error", "Server Error, try again!");
        res.redirect("back");
      });
  }
};
