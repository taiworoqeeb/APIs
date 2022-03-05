const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
require('dotenv').config()
const redisClient = redis.createClient({ legacyMode: true });
const { graphqlHTTP } = require('express-graphql');
const graphQlSchema = require('./graphql/schema/userSchema');
const graphQlResolvers = require('./graphql/controllers/index');
const isAuth = require('./middleware/isAuth');
const app = express();

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
app.use(isAuth);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json())

app.use('/graphql', 
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

module.exports = app;