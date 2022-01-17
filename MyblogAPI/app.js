const express = require('express');
require('dotenv').config();
const app = express();
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/blog/posts', postRouter);
app.use('/api/blog', userRouter);

module.exports = app;