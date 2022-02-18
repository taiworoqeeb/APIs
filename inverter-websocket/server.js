const mongoose = require('mongoose');
require('dotenv').config();
const app = require("./app");


const DB = process.env.DATABASE; //You can change the Mongodb Url (DATABASE) in the .env file from localhost url to your cloud url

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() =>  console.log('DataBase connection successful!'));

const port = process.env.PORT;
app.listen(port, (err) => {
  if (err) console.log("Error in Server setup");
  console.log(`listening to  http://localhost:${port}`);
});
