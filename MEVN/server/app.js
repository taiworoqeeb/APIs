const express = require('express');
const dotenv = require('dotenv');
const app = express();
const Router = require('./routes/routes');
const morgan = require('morgan');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.static("uploads"));


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}



app.use("/api/post", Router);

module.exports = app;
