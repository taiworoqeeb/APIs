require("dotenv").config();
//package import
const express = require("express");
const session = require("express-session");
const flash = require("express-flash-messages");
const passport = require("passport");
const Sequelize = require("sequelize");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
//const FacebookStrategy = require("passport-facebook").Strategy;
//const GoogleStrategy = require('passport-google-oauth2').Strategy;
//const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
//const Sequelize = require("sequelize");
//const Data = require("../libs/Data");
const uniqueString = require("unique-string");
const generateUniqueId = require("generate-unique-id");
//const upload = require("../helpers/mult_helper");
//const postUpload = require("../helpers/upload");
//const cloudinary = require("../helpers/cloudinary");
//const multer = require("multer");
const path = require("path");

// imports initialization
const Op = Sequelize.Op;
const router = express.Router();

//local import
const Admin = require("../models/").adminuser;
const AdminController = require("../controllers/admin.controller");
const AuthMiddleware = require("../middleware/Authmiddleware");

//middlewares

router.use(cookieParser());
router.use(
  cookieSession({
    name: process.env.SESSION_NAME,
    keys: [process.env.SESSION_SECRET, process.env.SESSION_SECRET],
  })
);

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

router.use(flash());

//routes

router.get("/", AuthMiddleware.redirectLogin, (req, res, next) => {
  res.render("dashboards/index");
});

router.get("/dashboard", (req, res, next) => {
  res.render("dashboards/index");
});

router.get("/signup", AdminController.signUpUser);
//router.post("/admin", AdminController.loginAdmin);
router.post("/createAdminUser", AdminController.createAdminUser);
//router.post("/signup", [AuthMiddleware.redirectHome, AuthMiddleware.authVerirfication], AdminController.register);
//router.get("/signup", AdminController.signup);
router.get("/login", AuthMiddleware.redirectHome, AdminController.adminLogin);
router.post("/loginAdminUser", AdminController.loginAdminUser);
router.get("/forgot", AdminController.forgotPassword);
router.get("/resetpassword", AdminController.resetPassword);
/* router.get(
  "/dashboard",
  AuthMiddleware.redirectLogin,
  AdminController.dashboard
); */

//router.get("/admin", AdminController.adminLogin);

module.exports = router;
