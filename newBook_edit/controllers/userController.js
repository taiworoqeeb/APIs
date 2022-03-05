const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//const { roles } = require('../roles');
const express = require('express');
const app = express();
const sessions = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(sessions);
const client  = redis.createClient();
require('dotenv').config();


const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: process.env.SS,
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
    saveUninitialized:false,
    cookie: { maxAge: oneDay },
    resave: false
}));
 
async function hashPassword(password) {
 return await bcrypt.hash(password, 10);
}
 
async function validatePassword(plainPassword, hashedPassword) {
 return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.grantAccess = function(permissions) {
    return async (req, res, next) => {
     try {
        const user = await User.findOne({role: "admin"})
        const user2 = await User.findOne({role: "basic"})
         const userRole = user.role;
         const userRole2 = user2.role;
         if (permissions.includes(userRole)) {
            next();
        } else{
            if(permissions.includes(userRole2)){
                return res.status(401).json("You are not authorized")
        }
    }

     } catch (error) {
      next(error)
    }
   }
}


/*exports.allowIfLoggedin = async (req, res, next) => {
    try {
     const session = res.session;
     if(session.userId){
        next()
      } else{
          res.status(403).json({
              error: "you need to login"
          });
      }; 
     } catch (error) {
      next(error);
     }
   } */



exports.signup = async (req, res, next) => {
 try {
  const { username, email, password, role } = req.body
  const hashedPassword = await hashPassword(password);
  const newUser = new User({ username, email, password: hashedPassword, role: role || "basic" });
  const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
   expiresIn: "1d"
  });
  newUser.accessToken = accessToken;
  await newUser.save();
  res.json({newUser})
 } catch (error) {
  next(error)
 }
};

/*exports.logout =async(req, res, next) => {
    req.sessions.destroy((err) => {
        if(err) {
            return console.log(err);
        }
    });
}*/

exports.login = async (req, res, next) => {
    try {
     const { email, password } = req.body;
     const user = await User.findOne({ email });
     if (!user) return next(new Error('Email does not exist'));
     const validPassword = await validatePassword(password, user.password);
     if (!validPassword) return next(new Error('Password is not correct'))
     const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
     });
     await User.findByIdAndUpdate(user._id, { accessToken })
     res.status(200).json({
      data: { email: user.email, role: user.role },
      accessToken
     })
     const session = req.sessions;
     session.email = req.body.email;
    } catch (error) {
     next(error);
    }
   };

exports.getUsers = async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
     data: users
    });
   }
    
exports.getUser = async (req, res, next) => {
    try {
     const userId = req.params.id;
     const user = await User.findById(userId);
     if (!user) return next(new Error('User does not exist'));
      res.status(200).json({
      data: user
     });
    } catch (error) {
     next(error)
    }
   }
    
exports.updateUser = async (req, res, next) => {
    try {
     const update = req.body
     const userId = req.params.id;
     await User.findByIdAndUpdate(userId, update);
     const user = await User.findById(userId)
     res.status(200).json({
      data: user,
      message: 'User has been updated'
     });
    } catch (error) {
     next(error)
    }
   }
    
exports.deleteUser = async (req, res, next) => {
    try {
     const userId = req.params.id;
     await User.findByIdAndDelete(userId);
     res.status(200).json({
      data: null,
      message: 'User has been deleted'
     });
    } catch (error) {
     next(error)
    }
   }

