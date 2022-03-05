const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');


app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);