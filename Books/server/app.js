const express = require('express');
const app = express();
const Router = require('./routes/routes');
const bodyParser = require('body-parser');



app.use(express.json());

app.use('/api', Router);

module.exports = app;