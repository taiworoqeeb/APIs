const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");


const DB = process.env.DATABASE;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() =>  console.log('DataBase connection successful!'));

const port = process.env.PORT;
app.listen(port, (err) => {
  if (err) console.log("Error in Server setup");
  console.log(`listening to port ${port}`);
});