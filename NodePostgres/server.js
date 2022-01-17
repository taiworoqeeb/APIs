const {Client} = require("pg");
require("dotenv").config();
const app = require("./app");

const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB
})

client.connect();



const port = process.env.PORT;
app.listen(port, (err) => {
  if (err) console.log("Error in Server setup");
  console.log(`listening to port ${port}, http://localhost:${port}`);
});