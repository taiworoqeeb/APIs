require("dotenv").config();
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const moment = require("moment");

const User = require("../models").User;
const Payment = require("../models").Payment;
const Transaction = require("../models").Transaction;
const Deposit = require("../models").Deposit;
const Withdrawal = require("../models").Withdrawal;

const BankDetail = require("../models").BankDetail;
const {Service} = require("../service/payment");
const Notification = require("../helpers/notification");
const EmailService = require("../service/emailService");
const Op = Sequelize.Op;

exports.addBankDetails = async(req, res) =>{
    try {
        const {bank_name, account_name, account_number} = req.body;
        const userId = req.user.id;
        const request = {
            bank_name,
            account_name,
            userId,
            account_number
        };
        await BankDetail.create(request);
        return res.status(200).send({
            status: true,
            message: "Bank details Added"
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.getUserBanks = async(req, res) => {
    try {
        const banks = await BankDetail.findAll({where:{userId: req.user.id}})
        return res.status(200).send({
            status: true,
            data: banks
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.getUserBankDetails = async(req, res) => {
    try {
        const bank = await BankDetail.findByPk(req.params.id)
        if (!bank) {
            return res.status(400).send({
                status: false,
                message: "No Bank Details Found",
            }); 
        }

        return res.status(200).send({
            status: true,
            data: bank
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.getBanks = async(req, res) => {
    try {
        const banks = await Service.Paystack.getbanks();
        return res.status(200).send({
            status: true,
            data: banks
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.verifyAccount = async(req, res) => {
    
    try {
        const { account_number, bank_code} = req.body;

        const bank = await Service.Paystack.resolveAccount(account_number, bank_code)
        return res.status(200).send({
            status: true,
            data: bank
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.fundWallet = async (req, res, next) => {
    try {
      const { amount, reference} = req.body
      const userId = req.user.id
      
      const user = await User.findOne({
        where: {
            id: userId
        }
      });
        
      if (user) {
        const userWallet = Number(user.wallet);
        const balance = Number(amount) + userWallet;
        await User.update({wallet: balance}, {where:{id: user.id}})
                      
        await Deposit.create({
          userId: user.id,
          amount,
          reference,
        });
        const payment = {
            userId: user.id,
            payment_category: "Fund Wallet",
            payment_reference: reference,
            amount
        }
        await Payment.create(payment);

        const message = 'Fund wallet';
        const history = {
            userId: user.id,
            description: message,
            amount
        }

        await Transaction.create(history);
        const { io } = req.app;
        const msge = `Your wallet was funded with ${amount} naira`;
        await Notification.createNotification({userId, type: "user", message:msge});
        const notifyParam = {
            userId
        }
        io.emit("getUserNotifications", await Notification.fetchUserNotificationApi(notifyParam));

                              
        return res.status(200).send({status: true, message: "Deposit Made Successfully"});
                                
      } else {
          console.log(`user not found`);
          return res.status(400).send({status: false, message: "User Not Found"})
      }
    } catch (error) {
      return res.status(500).send({status: false, message: "Server Error"})
    }
          
}

exports.getTransactionHistory = async (req, res) =>{
    try {
        const userId = req.user.id;
        const transactions = await Transaction.findAll({where: {userId}, order:[["createdAt", "DESC"]]});
        return res.status(200).send({
            status: true,
            transactions
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.withdrawFromWalletApi = async(req, res, next) => {
    try {
        let {
            acct_name,
            bank_name,
            bank_code,
            acct_number,
            amount
        } = req.body;
       console.log(req.body);
        if (!acct_number || !acct_name || !amount || !bank_name) {
            return res.status(400).send({
                status: false,
                message: "Please Fill all field"
            });
        } else {
            // get user wallet
            const user = await User.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.user.id
                        }
                    }
                });
                
            
                let type = 'Withdrawal'
                let desc = 'Withdrawal request initiated'
                let userWallet = Math.abs(Number(user.wallet));
                amount = Math.abs(Number(amount));
                if (amount > userWallet) {
                    return res.status(400).send({
                        status: false,
                        message: "Insufficient Fund"
                    });
                } else {
                    // console.log(user);
                    let owner = req.user.id
                    const paystack = await Service.Paystack.createTransferReceipt(acct_name, acct_number, bank_code);
                    // console.log(paystack);
                    if (paystack.status === true) {
                        
                        const metaData = {
                            account_number: paystack.data.details.account_number,
                            account_name: paystack.data.details.account_name,
                            bank_code: paystack.data.details.bank_code,
                            bank_name: paystack.data.details.bank_name,
                        }
                        const withdrawRequest = {
                            amount,
                            userId:owner,
                            acct_name,
                            acct_number,
                            bank_name,
                            bank_code,
                            recipient_code: paystack.data.recipient_code,
                            meta: JSON.stringify(metaData)
                        }
                        await Withdrawal.create(withdrawRequest)
                      
                        const message = `A Withdrawal Request of ${amount} was made by ${user.name}`;
                        const { io } = req.app;
                        await Notification.createNotification({userId:user.id, type: "admin", message});
                        io.emit("getNotifications", await Notification.fetchAdminNotification());
                        return res.status(200).send({
                            status: true,
                            message: "Withdrawal success, awaiting disbursement!"
                        });
                    }else{
                        return res.status(500).send({
                            status: false,
                            message: "Paystack Server Error"
                        });
                    }             
                }
            
        }
        
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error"+ error
        });
    }
}

exports.unapprovedWithdrawals = (req, res, next) => {
   
        Withdrawal.findAll({
           
            where: {
                status: "pending"
            },
            include: ["user"],
            order: [
                ['createdAt', 'DESC'],
            ],
        })
        .then(withdrawals => {
            // console.log({withdrawals});
            res.render("dashboards/unapproved_withdrawals", {
                withdrawals,
                moment,
                status: "Unapproved"
            });
        })
        .catch(error => {
            console.log(error)
            req.flash('error', "Server error "+error);
            res.redirect("back");
        });
    
}

exports.approvedWithdrawals = (req, res, next) => {
   
        Withdrawal.findAll({
            where: {
                status: req.query.status
            },
            include: ["user"],
            order: [
                ['createdAt', 'DESC'],
            ],
        })
        .then(withdrawals => {
            let status;
            if (req.query.status === "approved") {
                status = "Approved"
            }else{
                status = "Disapproved"
            }
            res.render("dashboards/unapproved_withdrawals", {
                withdrawals: withdrawals,
                moment,
                status
            });
        })
        .catch(error => {
            req.flash('error', "Server error");
            res.redirect("/");
        });
}

exports.withdrawalDetails = (req, res, next) => {
        Withdrawal.findOne({
            where: {
                id: req.params.id
            },
            include: ["user"]
        })
        .then(withdrawals => {
            const amount = Number(withdrawals.amount)
            const charge = ((3/100)* amount) + 200
            const takeHome = amount - charge
            res.render("dashboards/withdrawal_details", {
                withdrawals,
                moment,
                takeHome
            });
        })
        .catch(error => {
            req.flash('error', "Server error "+error);
            res.redirect("back");
        });
}

exports.postApproveWithdrawal = async(req, res, next) => {
   try {
    const {id, code} = req.body;
  
    const withdrawal = await Withdrawal.findOne({
             where: {
                 id: {
                     [Op.eq]: id
                }
            },
            include: ["user"]
         });
         let userWall = Number(withdrawal.user.wallet);
         let withAmt = Number(withdrawal.amount);
         if ( userWall < withAmt ) {
            req.flash('danger', "Insufficient Balance Please disapprove");
            res.redirect("back");
            return
         }
    const paystack = await Service.Paystack.finalizeTransfer(withdrawal.transfer_code, code);
    
     if(paystack.status === true) {
         let owner = withdrawal.userId
         
         await Withdrawal.update({
             status: "approved"
         }, {
             where: {
                 id: {
                     [Op.eq]: id
                 }
             }
         });
         const desc = `Withdrawal of ${withAmt}`;
         await Transaction.create({
            description:desc,
            amount: withAmt,
            userId:owner
        });
         const wallet = withdrawal.user.wallet;
         const amount = withdrawal.amount;
         
         const balance = Number(wallet) - Number(amount);
         await User.update({wallet: balance}, {where:{id: withdrawal.userId}});
        
         const subject = "[EventSocial Hype] Withdrawal Receipt";
            const now  = moment();
            const output =`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Withdrawal Receipt</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
                <style>
                    .receipt-div{
                        border: 1px solid rgb(202, 202, 202);
                        padding: 12px;
                    }
                    .receipt-div img{
                        padding-bottom: 30px;
                    }
                    .receipt-div .header-alert{
                        background-color: #6ea311;
                        padding: 10px;
                        color: #fff;
                        font-size: 20px;
                    }
                    .receipt-div .amount-div{
                        padding: 30px 10px !important;
                        background-color:#6ea311"
                    }
                    .receipt-div .amount-div .amount{
                        margin-top: -10px;
                        font-size: 45px;
                        color: #1c0970;
                        font-weight: bold;
                    }
                    .receipt-div .amount-div p{
                        font-size: 20px;
                    }
                    .receipt-div .details p{
                        font-size: 15px;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <main>
                    <div class="container py-2">
                        <div class="row">
                            <div class="col-sm-3"></div>
                            <div class="col-sm-6">
                                <div class="receipt-div">
                                    <div class="row">
                                        <div class="col-sm-12 text-center">
                                            <img src="https://res.cloudinary.com/yhomi1996/image/upload/v1647092701/logo_yxy3ps.png" alt="EventSocialLogo">
                                        </div>
                                        <div class="col-sm-12 text-center header-alert">
                                            Your Withdrawal Was Successful!
                                        </div>
                                        <div class="col-sm-12 text-center amount-div">
                                            <p>You just withdraw</p>
                                            <h1 class="amount">&#8358; ${withdrawal.amount}</h1>
                                            <p>from your wallet</p>
                                        </div>
                                        <div class="col-sm-12 py-3 text-center" style="font-size: 25px; font-weight: bold; text-decoration: underline;">
                                            Transaction Details
                                        </div>
                                        <div class="col-sm-12 details">
                                            <p><span>Amount:</span> <span style="float: right;">&#8358;${withdrawal.amount}</span></p>
                                            <hr size="3">
                                            <p><span>Account Name:</span> <span style="float: right;">${withdrawal.acct_name}</span></p>
                                            <hr size="3">
                                            <p><span>Account Number:</span> <span style="float: right;">${withdrawal.acct_number}</span></p>
                                            <hr size="3">
                                            <p><span>Bank Name:</span> <span style="float: right;">${withdrawal.bank_name}</span></p>
                                            <hr size="3">
                                            <p><span>Transaction Reference:</span> <span style="float: right;">${withdrawal.reference}</span></p>
                                            <hr size="3">
                                            <p><span>Transaction Date:</span> <span style="float: right;">${now}</span></p>
                                            <hr size="3">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-3"></div>
                        </div>
                    </div>
                </main>
            </body>
            </html>`
           await EmailService.sendMail(withdrawal.user.email, output, subject);
        req.flash('success', "Withdrawal Approved successfully");
        res.redirect("back");
         
     } else {
         req.flash('error', "Paystack Error");
         res.redirect("/dashboard");
     }
   } catch (error) {
        req.flash('error', "Server error!");
        res.redirect("back");
   }
        
}

exports.postDisApproveWithdrawal = (req, res, next) => {
    id = req.body.id;
    Withdrawal.findOne({
            where: {
                id: {
                    [Op.eq]: id
                }
            }
        })
        .then(withdrawal => {
            if(withdrawal) {
                Withdrawal.update({
                    status: "disapproved"
                }, {
                    where: {
                        id: {
                            [Op.eq]: id
                        }
                    }
                })
                .then(updatedWithdrawal => {
                    req.flash('success', "Withdrawal updated successfully");
                    res.redirect("back");
                })
                .catch(error => {
                    req.flash('error', "Server error");
                    res.redirect("back");
                });
            } else {
                req.flash('error', "Invalid withdrawal");
                    res.redirect("back");
            }
        })
        .catch(error => {
            req.flash('error', "Server error");
            res.redirect("back");
        });
}

exports.payWithPaystack = async(req, res, next) => {
    const{id, amount, type } = req.body;
    try {
        const withdrawal = await Withdrawal.findOne({
            where: {
                id: {
                    [Op.eq]: id
                }
            }
        });
        if (!withdrawal) {
            return res.status(404).json({
                success: false,
                message: "Withdrawal Not found"
            })
        }
        const response = await Service.Paystack.payout({amount, type, recipient_code: withdrawal.recipient_code});
        console.log(response);
        await Withdrawal.update({
            transfer_code: response.data.transfer_code,
            reference: response.data.reference
            }, {
                where: {
                    id: {
                        [Op.eq]: id
                    }
                }
        });

        return res.json({
            success: true,
            message: "Transfer Initiated",
            data: response.data
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An Error Occurred Please Contact Service Provider"
        })
    }
}

exports.convertToEhypeCurrency = async (req, res) =>{
    try {
        const {amount} = req.body;
        const userId = req.user.id;
        if(!amount){
            return res.status(400).send({
                status: false,
                message: "Please Fill Amount"
            });
        }
        const user = await User.findByPk(userId);
        const wallet = Number(user.wallet);
        const eHypeCurrency = Number(user.eHypeCurrency);
        if (wallet < amount) {
            return res.status(400).send({
                status: false,
                message: "Insufficient Balance"
            });
        }
        // add bonus 5% of amount
        const bonus = (5/100) * Number(amount)
        const balance = wallet - amount;
        const currency = eHypeCurrency + amount + bonus;
        await User.update({wallet: balance, eHypeCurrency:currency}, {where:{id: userId}});

        const message = `Converted ${amount} to E-hype currency`;
        const history = {
            userId,
            description: message,
            amount
        }
    
        await Transaction.create(history);

        return res.status(200).send({
            status: true,
            message: "Money converted to E-hype Currency"
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error"+ error
        });
    }
}