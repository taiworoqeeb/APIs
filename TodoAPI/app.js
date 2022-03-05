const express = require('express');
const dotenv = require('dotenv');
const app = express();
const taskRouter = require('./routes/taskRoutes');
const userRouter = require('./routes/userRoutes');




if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/task/user', taskRouter);
app.use('/api/task', userRouter);

module.exports = app;
