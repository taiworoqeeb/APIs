const express = require('express');
const app = express();
const Session = require('express-session');
const passport = require('passport');
var MongoDBStore = require('connect-mongodb-session')(Session)
const cors = require("cors");
const router = require('./routes/routes');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const ws = new WebSocket("wss://mwp2s3uoui.execute-api.us-east-2.amazonaws.com/dev/");
const path = require('path');





var store = new MongoDBStore({
  uri: process.env.DATABASE,
  collection: 'mySessions'
});

// Catch errors
store.on('error', function(error) {
  console.log(error);
});

app.use(Session({
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
app.use(express.static('build'))
app.use('/', router);
app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
}, router);



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