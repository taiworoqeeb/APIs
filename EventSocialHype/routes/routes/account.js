const express = require('express');
const AccountController = require("../../controllers/AccountController");
const Auth = require("../../middlewares/Auth");
const { validate, bankValidation, accountValidation, fundwalletValidation, withdrawalValidation } = require("../../helpers/validators");

const router = express.Router();

router.post("/account/add/bank-details", bankValidation(), validate, Auth, AccountController.addBankDetails);

router.get("/account/get/user-banks", Auth, AccountController.getUserBanks);

router.get("/account/user-bank-details/:id", Auth, AccountController.getUserBankDetails);

router.get("/account/banks", Auth, AccountController.getBanks);

router.post("/account/verify-account", accountValidation(), validate, Auth, AccountController.verifyAccount);

router.post("/fundwallet", fundwalletValidation(), validate, Auth, AccountController.fundWallet);

router.get("/account/transactions", Auth, AccountController.getTransactionHistory);

router.post("/account/userwithdraw", withdrawalValidation(), validate, Auth, AccountController.withdrawFromWalletApi);

router.post("/account/convert-to-ehype-currency", Auth, AccountController.convertToEhypeCurrency);

module.exports = router;