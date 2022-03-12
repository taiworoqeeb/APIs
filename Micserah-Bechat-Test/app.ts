import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import Auth from './middleware/passport';
import * as redis from 'redis';
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
dotenv.config();
const app = express();
import router from './routes/routes';


const redisURL = process.env.REDIS_URL as string;

const redisClient = redis.createClient({
    url: redisURL,
    legacyMode: true
});

redisClient.connect().catch(console.error);

redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
  });

redisClient.on('error', function (err) {
  console.log('Could not establish a connection with redis. ' + err);
});

app.use(
    session({
    secret: process.env.SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 10 * 60 * 1000,
      secure: true
    },
    store: new RedisStore({ client: redisClient })
  })
);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(passport.initialize());
app.use(passport.session());
Auth(passport);
app.use('/', router);


export default app;