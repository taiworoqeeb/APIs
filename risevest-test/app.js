'use strict';
const db = require('./configs/config');
const cors = require("cors")
const express = require('express');
const app = express();
const router = require('./routes/routes')
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
require('dotenv').config()
const fileUpload = require('express-fileupload')

const redisClient = redis.createClient({ legacyMode: true });

//Configure redis client
redisClient.connect().catch(console.error);

redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
  });

redisClient.on('error', function (err) {
  console.log('Could not establish a connection with redis. ' + err);
});


app.use(
  session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 10 * 60 * 1000,
    secure: true
  },
  store: new RedisStore({ client: redisClient })
})
);
app.use(fileUpload());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());
app.use('/', router);
require('./middlewares/passport')(passport);



db.authenticate()
    .then(() => console.log("Database connected"))
    .catch(err => console.log('Error: ' + err ))



const port = process.env.PORT;
app.listen(port, (err) => {
  if (err) console.log("Error in Server setup");
  console.log(`listening to http://localhost:${port}`);
});


module.exports = app;