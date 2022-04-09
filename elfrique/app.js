// package imports
require("dotenv").config();
const Sequelize = require("sequelize");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");


const apiRoute = require("./routes/apiRoute");
const webRoute = require("./routes/webRoutes");

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// routes includes

// imports initalization

const server = http.createServer(app);
let users = [];

// middlewares
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "POST, PUT, GET, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use(morgan("tiny"));
// routes
app.use("/", webRoute);
app.use("/api/v1", apiRoute);

/* app.get("/", (req, res, next) => {
  res.render("signup2");
}); */

// 404 not found

// server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
