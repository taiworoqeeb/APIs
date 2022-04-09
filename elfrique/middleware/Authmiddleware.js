const Sequelize = require("sequelize");
const adminUsers = require("../models").adminuser;
// imports initialization
const Op = Sequelize.Op;

exports.redirectLogin = (req, res, next) => {
  console.log(req.session.adminId);
  if (!req.session.adminId) {
    res.redirect("/login");
  } else {
    next();
  }
};

exports.redirectHome = (req, res, next) => {
  if (req.session.adminId) {
    res.redirect("/dashboard");
  } else {
    next();
  }
};
