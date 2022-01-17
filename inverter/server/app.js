'use strict';
const cors = require("cors")
const express = require('express');
const app = express();
const router = require('./routes/routes')
const bodyParser = require('body-parser');
const passport = require('passport');
const expressSession = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(expressSession)
//const jwt = require('jsonwebtoken');
require('dotenv').config()
//let staff = require('./model/staffmodel');




var store = new MongoDBStore({
  uri: process.env.DATABASE,
  collection: 'mySessions'
});

// Catch errors
store.on('error', function(error) {
  console.log(error);
});

app.use(expressSession({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  // setting the max age to longer duration
  cookie: {
  maxAge: 24 * 60 * 60 * 1000,
  secure: true
    },
  store: store
}));


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());

require('./middlewares/passport')(passport);

app.use('/', router);


/*app.use( (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.TOKEN, (err, decode) => {
          if (err) req.staff = undefined;
          req.staff = decode;
          next();
        });
      } else {
        req.staff = undefined;
        next();
      }
})
*/

module.exports = app;