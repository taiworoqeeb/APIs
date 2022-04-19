require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const moment = require("moment");

const User = require("../models").User;
const SmsService = require("../service/smsService");
const EmailService = require("../service/emailService");
const { generateCode } = require('../helpers');
const Notification = require("../helpers/notification");
const Admins = require("../models").Admin;

const excludeAtrributes = {exclude: [ 
    "createdAt", 
    "updatedAt",
    "deletedAt"
]}

// imports initialization
const {Op} = require("sequelize");

exports.registerUser = async(req, res, next)=>{
   
    try {
        const { name,
            email,
            phone,
            password,
            username,
            role,
            business,
            address,
            state,
            city,
            country,
        } = req.body;
        const user = await User.findOne({where: {email}, attributes:["id", "email"]});
        
        if(user){
            return res.status(400).send({
                status: false,
                message:"This email already exists"
            });
        }
        const hashPwd = bcrypt.hashSync(password, 10);          
        
        const request = {
            name,
            email,
            phone,
            password:hashPwd,
            username,
            role,
            business,
            address,
            state,
            city,
            country
        }
        
        const savedUser = await User.create(request);
        if(savedUser){
            const token  = generateCode(); 
            await User.update({token},{where:{id: savedUser.id}});
            const num = phone.substring(1);
            const phoneNum = '+234'+num;
            const message = `Use The token to verify your Account.\n ${token}`
            await SmsService.sendSMS(phone, message);
            await EmailService.sendMail(email, message, "Verify Account")
        }

        const mesg = "A new user was created";
        const userId = savedUser.id;
        const type = "admin"
        const { io } = req.app;
        await Notification.createNotification({userId, type, message:mesg});
        io.emit("getNotifications", await Notification.fetchAdminNotification());
        
        return res.status(200).send({
            status:true,
            message:"Registration successful"
        });
    } catch (error) {
        // console.log(error.response);
        return res.status(500).send({
            status: false,
            message: "Server Error"
        })
    }
}

exports.login = async(req, res, next)=>{
   
    try {
        const {email, password} = req.body
        const user = await User.findOne({where:{email}, attributes: {exclude: [ 
        "createdAt", 
        "updatedAt",
        "deletedAt"
    ]}});
        if(!user) {
            return res.status(400).send({
                status: false,
                message:"User not found"
            })
        }else{
            if (user.activated !== 1) {
                return res.status(400).send({
                    status: false,
                    message:"Account not activated: Check your email for activation token"
                });
            }else{
                const compare = bcrypt.compareSync(password, user.password);
                if (!compare) {
                    return res.status(400).send({
                        status: false,
                        message: "Invalid Password"
                    })
                }else{
                    const payload = {
                        user: {
                            id: user.id,
                        },
                        };
                    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 36000});
                    return res.status(200).send({
                        status: true,
                        token, 
                        user
                    })
                }
            }
        }
    } catch (error) {
        
        return res.status(500).send({
            status: false,
            message: "Server Error"
        })
    }
}

exports.resendCode = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({where:{email}});
        if (!user) {
            return res.status(404).send({
                status: false,
                message: "No User found with this email"
            });
        }

        const phone = user.phone;
        const token = generateCode();
        await User.update({token},{where:{id: user.id}});
        const num = phone.substring(1);
        const phoneNum = '+234'+num;
        const message = `Use The token to verify your Account.\n ${token}`;
        const subject = "Account Verification";
        await SmsService.sendSMS(phone, message);
        await EmailService.sendMail(email, message, subject);
        return res.status(200).send({
            status: true,
            message: "Token Sent check email or mobile number"
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error"
        });
    }
}

exports.verifyUser = async(req, res) =>{
    try {
        const {email, token} = req.body;
        const user = await User.findOne({where:{email}});
        if (!user) {
            return res.status(404).send({
                status: false,
                message: "No User found with this email"
            });
        }
        const userToken = user.token;
        if (token !== userToken) {
            return res.status(400).send({
                status: false,
                message: "Invalid Code"
            });
        }
        await user.update({activated:1});
        return res.status(200).send({
            status: true,
            message: "Account Activated Successfully"
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error"
        });
    }
}

exports.checkAuth = async(req, res, next)=>{
    try {
        const id = req.user.id
        const user = await User.findOne({where:{id}})
        return res.status(200).send({
            status:true,
            user
        })
    } catch (error) {
        
        return res.status(500).send({
            status: false,
            message: "Server Error"
        })
    }
}

exports.testDate = async(req, res) =>{
    try {
        const {effectDate} = req.body
        const now = moment().format("DD-MM-YYYY");
        const date = moment(effectDate).format("DD-MM-YYYY");
        return res.send({now, effectDate})
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error"
        })
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        const id = req.user.id
        const { oldPassword, password, confirmPassword } = req.body;
        if (password !== confirmPassword ) {
            return res.status(500).send({
                status: false,
                message: "Passwords do not match"
            });
        }
    
        const user = await User.findOne({
            where: {
            id: {
                [Op.eq]: id,
            },
            },
        });
       
        if (!bcrypt.compareSync(oldPassword, user.password)) {
            return res.status(500).send({
                status: false,
                message: "Incorrect Old Password"
            })
            
        }
        let currentPassword = bcrypt.hashSync(password, 10);
        await User.update(
            {
            password: currentPassword,
            },
            {
            where: {
                id: {
                [Op.eq]: id,
                },
            },
            }
        );
        return res.status(200).send({
            status: true,
            message: "Password Changed Successfully",
            user
        });
        
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error"
        })
    }
};

exports.updateUserProfile = async (req, res, next) => {
    try {
        const id = req.user.id
        const user = await User.findByPk(id)
        if (!user) {
            return res.status(400).send({
                status: false,
                message: "No user Found",
            }); 
        }

        await user.update(req.body);
                
        return res.status(200).send({
            status: true,
            user,
            message: "User profile updated",
        });
        
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error"
        })
    }
};

exports.loginAdmin = async(req,res,next) =>{
    try {
      const {email, password } = req.body;
      console.log("It worked here...", req.body);
      if (!email || !password) {
        req.flash("error", "Please Fill all Fields!");
        res.redirect("back");
      }else{
        const admin = await Admins.findOne({where: {email}});
        if (!admin) {
          req.flash("error", "Invalid Details!");
          res.redirect("back");
        }else{
          const compare = bcrypt.compareSync(password, admin.password);
          if (!compare) {
            req.flash("error", "Incorrect Password!");
            res.redirect("back");
          }else{
            req.flash("success", "LoggedIn Successfully");
            req.session.adminId = admin.id;
            req.session.role = admin.level
            res.redirect('/dashboard')
          }
        }
      }
    } catch (err) {
      req.flash("error", "Server Error!");
      res.redirect("back");
    }
}
  
exports.createAdmin = async(req, res, next)=>{
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    try {
      const {name, email, password, level} = req.body;
      if (!name || !email || !password || !level) {
        req.flash("danger", "Please Fill all Fields!");
        res.redirect("back");
      } else if (!email.match(mailformat)){
        req.flash("warning", "Wrong Email Format!");
        res.redirect("back");
      }else if(password.length < 5) {
        req.flash("warning", "Password should be more than 5 characters!");
        res.redirect("back");
      }else{
        const admin = await Admins.findOne({where: {email}});
        if(admin) {
          req.flash("warning", "This Email already exists!");
          res.redirect("back");
        }else{
          
          const hashPwd = await bcrypt.hashSync(password, 10);
          const newAdmin = await Admins.create({name, email, password:hashPwd, level});
          req.flash("success", "Admin Created Succsessfully");
          res.redirect("back");
        }
      }
    } catch (err) {
      req.flash("danger", "Server Error!");
      res.redirect("back");
    }
}

exports.changeAdminPassword = (req, res, next) => {
    const { oldPassword, password, confirmPassword } = req.body;
    // check if any of them are empty
    if (!oldPassword || !password || !confirmPassword) {
      req.flash("warning", "enter all fields");
      res.redirect("back");
    } else if (confirmPassword != password) {
      req.flash("warning", "passwords must match");
      res.redirect("back");
    } else if (confirmPassword.length < 6 || password.length < 6) {
      req.flash("warning", "passwords must be greater than 5 letters");
      res.redirect("back");
    } else {
      Admins.findOne({
        where: {
          id: {
            [Op.eq]: req.session.adminId,
          },
        },
      })
        .then((response) => {
          if (bcrypt.compareSync(oldPassword, response.password)) {
            // password correct
            // update it then
            let currentPassword = bcrypt.hashSync(password, 10);
            Admins.update(
              {
                password: currentPassword,
              },
              {
                where: {
                  id: {
                    [Op.eq]: req.session.adminId,
                  },
                },
              }
            )
              .then((response) => {
                req.flash("success", "Password updated successfully");
                res.redirect("back");
              })
              .catch((error) => {
                req.flash("error", "something went wrong");
                res.redirect("back");
              });
          } else {
            req.flash("warning", "incorrect old password");
            res.redirect("back");
          }
        })
        .catch((error) => {
          req.flash("error", "something went wrong");
          res.redirect("back");
        });
    }
};

exports.logout = (req, res, next) => {
    req.session = null;
    res.redirect("/");
};

exports.resendCode = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({where:{email}});
        if (!user) {
            return res.status(404).send({
                status: false,
                message: "No User found with this email"
            });
        }

        const phone = user.phone;
        const token = generateCode();
        await User.update({token},{where:{id: user.id}});
        const num = phone.substring(1);
        const phoneNum = '+234'+num;
        const message = `Use The token to verify your Account.\n ${token}`;
        const subject = "Account Verification";
        await SmsService.sendSMS(phone, message);
        await EmailService.sendMail(email, message, subject);
        return res.status(200).send({
            status: true,
            message: "Token Sent check email or mobile number"
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error"
        });
    }
}

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email, password, confirmPassword } = req.body;
        if (password !== confirmPassword ) {
            return res.status(500).send({
                status: false,
                message: "Passwords do not match"
            });
        }
    
        const user = await User.findOne({
            where: {email},
        });
    
        let currentPassword = bcrypt.hashSync(password, 10);
        await User.update(
            {
            password: currentPassword,
            },
            {
            where: {email},
            }
        );
        return res.status(200).send({
            status: true,
            message: "Password Changed Successfully",
            user
        });
        
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error"
        })
    }
};