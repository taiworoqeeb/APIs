const express = require("express");
const userController = require("../Controllers/userController");

const router = express.Router();

router
.route('/register')
.post(userController.UserRegister);

router
.route('/login')
.post(userController.UserLogin);

module.exports = router;
