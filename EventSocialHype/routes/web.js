// package imports
require("dotenv").config()
const express = require('express');
const session = require("express-session");
const flash = require("express-flash-messages");
const passport = require("passport");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const Sequelize = require("sequelize");
const AuthController = require("../controllers/AuthController");
const DashboardController = require("../controllers/DashboardController");
const UserController = require("../controllers/UserController");
const ChatController = require("../controllers/ChatController");
const EventController = require("../controllers/EventController");
const PackageController = require("../controllers/PackageController");
const AccountController = require("../controllers/AccountController");
const AuthMiddleware = require("../middlewares/auth_middleware");
const upload = require("../helpers/upload");

const Op = Sequelize.Op;
const router = express.Router();
const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7;

// middlewares
// router.use(passport.initialize());
// router.use(passport.session());
router.use(cookieParser());

router.use(cookieSession({
    name: process.env.SESSION_NAME,
    keys: [process.env.SESSION_SECRET, process.env.SESSION_SECRET]
}));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

router.use(session({
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: SEVEN_DAYS,
        sameSite: true,
        secure: true
    }
}));


// ensuring when users logout they can't go back with back button
router.use(function (req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

router.use( function(req, res, next) {
    res.locals.role = req.session.role;
    next();
});

router.use(flash());


// routes
router.post("/admin", AuthController.loginAdmin);
router.post("/createAdmin", AuthController.createAdmin);
router.get('/admin', (req, res) =>{
    res.render("auths/loginb");
});
router.post("/logout",  AuthMiddleware.redirectAdminLogin, AuthController.logout);
router.get("/dashboard", AuthMiddleware.redirectAdminLogin, DashboardController.AdminHome);
router.get("/admin-password", AuthMiddleware.redirectAdminLogin, DashboardController.adminPassword);
router.post("/admin-update-password", AuthMiddleware.redirectAdminLogin, AuthController.changeAdminPassword);
router.get("/users", AuthMiddleware.redirectAdminLogin, UserController.allUsers);
router.post("/delete/user", AuthMiddleware.redirectAdminLogin, UserController.deleteUser);
router.post("/edit/user", AuthMiddleware.redirectAdminLogin, UserController.postEditUser);
router.get("/edit/user/:id", AuthMiddleware.redirectAdminLogin, UserController.editUser);
router.get("/deleted/users", AuthMiddleware.redirectAdminLogin, UserController.viewDeletedUsers);
router.post("/restore/user", AuthMiddleware.redirectAdminLogin, UserController.restoreUser);
router.get("/admins", AuthMiddleware.redirectAdminLogin, UserController.allAdmins);
router.get("/deleted/admins", AuthMiddleware.redirectAdminLogin, UserController.viewDeletedAdmins);
router.post("/restore/Admin", AuthMiddleware.redirectAdminLogin, UserController.restoreAdmin);
router.post("/delete/admin", AuthMiddleware.redirectAdminLogin, UserController.deleteAdmin);
router.post("/disable-withdrawal-button", AuthMiddleware.redirectAdminLogin, UserController.disableControl);
router.post("/enable-withdrawal-button", AuthMiddleware.redirectAdminLogin, UserController.enableControl);
router.get('/adminmessages',AuthMiddleware.redirectAdminLogin, ChatController.adminMessage);
router.post("/delete/announcement", AuthMiddleware.redirectAdminLogin, ChatController.deleteAnnouncement);
router.post("/sendmessage", AuthMiddleware.redirectAdminLogin, ChatController.postAnnouncement);
router.get("/view/announcements", AuthMiddleware.redirectAdminLogin, ChatController.viewAnnouncements);

// Admin Event
router.get("/admin-event", AuthMiddleware.redirectAdminLogin, EventController.allEvents);
router.get("/admin/my-event/:id", AuthMiddleware.redirectAdminLogin, EventController.adminEvent);
router.post("/approve/event", AuthMiddleware.redirectAdminLogin, EventController.approveEvent)
router.post("/disapprove/event", AuthMiddleware.redirectAdminLogin, EventController.disApproveEvent);
router.post("/enable-control-button", AuthMiddleware.redirectAdminLogin, EventController.enableControl);
router.post("/disable-control-button", AuthMiddleware.redirectAdminLogin, EventController.disableControl);
router.post("/event/add-trust-score", AuthMiddleware.redirectAdminLogin, EventController.updateTrustScore);
router.post("/delete/event", EventController.AdmindeleteEvent);

// packages
router.get("/add/package", AuthMiddleware.redirectAdminLogin, PackageController.addPackage);
router.get("/view/packages", AuthMiddleware.redirectAdminLogin, PackageController.adminAllPackages);
router.post("/add/package", AuthMiddleware.redirectAdminLogin, PackageController.postAddPackage);
router.post("/update/package", AuthMiddleware.redirectAdminLogin, PackageController.postUpdatePackage);
router.post("/delete/package", AuthMiddleware.redirectAdminLogin, PackageController.deletePackage);
router.get("/edit/package/:id", AuthMiddleware.redirectAdminLogin, PackageController.editPackage);
router.get("/promotions", AuthMiddleware.redirectAdminLogin, PackageController.allSubscription);
router.get("/view/merchandise/:id", AuthMiddleware.redirectAdminLogin, EventController.viewAllMerchandise);
router.get("/merchandise/sales/:id", AuthMiddleware.redirectAdminLogin, EventController.viewAllMerchandiseSales);

// Withdrawal
router.post("/adminpayout", AccountController.payWithPaystack);
router.get("/unapproved-withdrawal", AuthMiddleware.redirectAdminLogin, AccountController.unapprovedWithdrawals);
router.get("/approved-withdrawal", AuthMiddleware.redirectAdminLogin, AccountController.approvedWithdrawals);
router.get("/withdrawal-detail/:id", AuthMiddleware.redirectAdminLogin, AccountController.withdrawalDetails);
router.post("/unapprove-withdrawal", AuthMiddleware.redirectAdminLogin, AccountController.postDisApproveWithdrawal);
router.post("/approve-withdrawal", AuthMiddleware.redirectAdminLogin, AccountController.postApproveWithdrawal);

// Banner
router.get("/banners", AuthMiddleware.redirectAdminLogin, EventController.viewAllBanners);
router.get("/create/banner", AuthMiddleware.redirectAdminLogin, EventController.createBanner);
router.post("/add/banner", upload.single('image'), AuthMiddleware.redirectAdminLogin, EventController.addNewBanner);
router.post("/delete/banner", AuthMiddleware.redirectAdminLogin, EventController.deleteBanner);
router.get("/view/banner/:id", AuthMiddleware.redirectAdminLogin, EventController.viewBanner);


module.exports = router;