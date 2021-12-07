require('dotenv').config();

const {HOST, USER, PW} = process.env;


module.exports = {
  "development": {
    "username": USER,
    "password": PW,
    "database": "database_dev",
    "host": HOST,
    "dialect": "postgres"
  },
  "test": {
    "username": USER,
    "password": PW,
    "database": "database_test",
    "host": HOST,
    "dialect": "postgres"
  },
  "production": {
    "username": USER,
    "password": PW,
    "database": "database_prod",
    "host": HOST,
    "dialect": "postgres"
  }
};
