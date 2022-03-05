const express = require('express');
const morgan = require('morgan');

const movieRouter = require('./routes/movieRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
//app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Welcome to Movieplace');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/movies', movieRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
