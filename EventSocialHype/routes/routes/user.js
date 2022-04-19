const express = require('express');
const AuthController = require("../../controllers/AuthController");
const ChatController = require("../../controllers/ChatController");
const Auth = require("../../middlewares/Auth");
const { 
    registerValidation, 
    validate, 
    codeValidation, 
    tokenValidation, 
    loginValidation, 
    changePasswordValidation,
    forgotPasswordValidation
} = require("../../helpers/validators");

const router = express.Router();

router.get('/user', Auth, AuthController.checkAuth);

router.post("/user/register", registerValidation(), validate, AuthController.registerUser);

router.post("/user/resend-token", codeValidation(), validate, AuthController.resendCode);

router.post("/user/verify-user", tokenValidation(), validate, AuthController.verifyUser);

router.post("/user/login", loginValidation(), validate, AuthController.login);

router.patch("/user/update-profile", Auth, AuthController.updateUserProfile);

router.post("/user/change-password", changePasswordValidation(), validate, Auth, AuthController.changePassword);

router.get("/admin-messages", ChatController.allAdminMessages);

router.post("/user/reset-password", forgotPasswordValidation(), validate, AuthController.forgotPassword);

module.exports = router;