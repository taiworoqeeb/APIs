const mongoose = require('mongoose');
require('dotenv').config();
const app = require("./app");
const session = require('express-session');
const MongoDBsession = require('connect-mongodb-session')(session);


const DB = process.env.DATABASE;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() =>  console.log('DB connection successful!'));

const store = new MongoDBsession({
  uri: DB,
  collection: 'usersession',
});

app.use( 
  session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: store
  })
);

const isAuth = (req, res, next) => {
  if(req.session.isAuth){
    next()
  } else{
    res.status(400).json('user not logged in');
  }
}

const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  if (err) console.log("Error in Server setup");
  console.log(`listening to port ${port}`);
});

module.exports = session;