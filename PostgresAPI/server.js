const express = require('express');
const app = express();
require('dotenv').config();
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.PW,
  port: process.env.DB_PORT
});






const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  if (err) console.log("Error in Server setup");
  console.log(`listening to port ${port}`);
});

module.exports = pool;