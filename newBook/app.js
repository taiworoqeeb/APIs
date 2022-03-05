const express = require('express');
const app = express();
const Router = require('./routes/routes');
const bodyParser = require('body-parser');
const User = require('./models/userModel');
const jwt = require('jsonwebtoken');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use('/', Router);

app.use(async (req, res, next) => {
    if (req.headers["x-access-token"]) {
     const accessToken = req.headers["x-access-token"];
     const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
     // Check if token has expired
     if (exp < Date.now().valueOf() / 1000) { 
      return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
     }  
    } else { 
     next(); 
    } 
   });

module.exports = app;