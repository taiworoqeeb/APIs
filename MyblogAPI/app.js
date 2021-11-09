const express = require('express');
const dotenv = require('dotenv');
const app = express();
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');




if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/blog/posts', postRouter);
app.use('/api/blog', userRouter);

module.exports = app;