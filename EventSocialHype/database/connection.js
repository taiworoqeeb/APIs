require("dotenv").config();
const Sequelize = require("sequelize");




const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT,
    raw: true,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 80000
    },
    
  }
);

sequelize.authenticate()
  .then(() => {
    console.log("Connection with database has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });
module.exports = sequelize;
