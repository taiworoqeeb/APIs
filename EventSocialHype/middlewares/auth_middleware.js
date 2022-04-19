const Sequelize = require("sequelize");
const Users = require("../models").User;

// imports initialization
const Op = Sequelize.Op;

exports.redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect("/");
    } else {
        next();
    }
}


exports.redirect2FALogin = (req, res, next) => {
    if(req.session.userTfa) {
        res.redirect("/home");
    } else {
        next();
    }
}

exports.redirect2FAEmailLogin = (req, res, next) => {
    if(req.session.userTFEmail) {
        res.redirect("back");
    } else {
        next();
    }
}

exports.redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect("/home");
    } else {
        next();
    }
}

exports.redirectUserLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect("/");
    } else if (req.session.role != '3') {
        res.redirect("/");
    } else {
        next();
    }
}

exports.redirectUserHome = (req, res, next) => {
    if (req.session.userId && (req.session.role == 3 || req.session.role == "3")) {
        res.redirect("/home");
    } else {
        next();
    }
}

exports.redirectAdminLogin = (req, res, next) => {
    if (!req.session.adminId) {
        res.redirect("/");
    } else {
        next();
    }
}
