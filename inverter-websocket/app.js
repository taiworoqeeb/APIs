const express = require('express');
const app = express();
const Session = require('express-session');
const passport = require('passport');
const redis = require('redis');
const RedisStore = require('connect-redis')(Session);
const cors = require("cors");
const router = require('./routes/routes');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const ws = new WebSocket("wss://mwp2s3uoui.execute-api.us-east-2.amazonaws.com/dev/");
const nocache = require('nocache');
//const onHeaders = require('on-headers')



const redisClient = redis.createClient({ legacyMode: true });

//Configure redis client
redisClient.connect().catch(console.error);

redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
  });

redisClient.on('error', function (err) {
  console.log('Could not establish a connection with redis. ' + err);
});

app.use(Session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  // setting the max age to longer duration
  cookie: {
    maxAge: 10 * 60 * 1000,
    secure: true
  },
  store: new RedisStore({ client: redisClient })
}));



app.disable('Etag');
app.use(nocache());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());

app.use('/', router);

require('./middlewares/passport')(passport);

ws.addEventListener('open', e=> {
    console.log('Websocket is connected')
});

ws.addEventListener('close', e=>{
    console.log('Websocket is closed')
})

ws.addEventListener('error', e=>{
    console.log('Websocket is in error')
});





module.exports = app;