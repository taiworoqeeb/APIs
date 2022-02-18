const Sequelize = require('sequelize');
require('dotenv').config();

const database = process.env.DATABASE;
const username = process.env.USER;
const password = process.env.PASSWORD;

var db = new Sequelize(database, username, password, {
    host: 'localhost',
    dialect: 'postgres',
  
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
});



module.exports = db