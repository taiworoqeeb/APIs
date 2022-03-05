const express = require('express');
const app = express();
const Router = require('./routes/routes');
const bodyParser = require('body-parser');
const User = require('./models/userModel');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
require('dotenv').config()

const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: process.env.SS,
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use('/', Router);

app.use(async (req, res, next) => {
    const userId = User._id;
    if (req.headers["x-access-token"]) {
     const accessToken = req.headers["x-access-token"];
     const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
     // Check if token has expired
     if (exp < Date.now().valueOf() / 1000) { 
      return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
     }  
     //res.locals.loggedInUser = await User.findById(userId);
     next();
    } else { 
     next(); 
    } 
   });

module.exports = app;