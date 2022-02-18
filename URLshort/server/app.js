const express = require('express');
const app = express();
const url = require('./routes/routes');



app.use(express.json({ extended: false }));
app.use('/', url);

module.exports = app;