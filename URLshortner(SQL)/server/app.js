const db = require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const url = require('./routes/routes');

app.use(express.json({ extended: false }));
app.use(bodyParser.json());
app.use('/', url);

db.authenticate()
    .then(() => console.log("Database connected"))
    .catch(err => console.log('Error: ' + err ))


const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server running on ${PORT}`));