const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
require('dotenv').config();
const Cors = require("cors");
const BodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");
const moment = require("moment");
const cron = require("node-cron");

const app = express();
const server = http.createServer(app);

const sequelize = require('./database/connection');
const Routes = require("./routes/routes");
const webRoute = require("./routes/web")
const webParameters = require("./config/web_params.json");
const Promotion = require("./models").Promotion;
const Notification = require("./helpers/notification")


app.use(Cors());
app.use(BodyParser.json({ limit: "50mb" }));

app.use(
  BodyParser.urlencoded({
    extended: false
  })
);
app.locals = webParameters;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(morgan('dev'))
// set up public folder
app.use(express.static(path.join(__dirname, "public")));
// Static Files
// dashboard 
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/images', express.static(__dirname + 'public/images'));

app.get("/", (req, res)=>{
  res.redirect("/admin")
})

app.use('/api', Routes);
app.use('/', webRoute);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"]
  }
});

app.io = io;

io.on("connection", async socket => {
  io.emit("getNotifications", await Notification.fetchAdminNotification());
  io.emit("getUserNotifications", await Notification.fetchUserNotificationApi(socket.handshake.query));
  socket.on("notification_read", async data => {
    console.log(data);
    const {id} = data
    socket.emit("markAsRead", await Notification.updateNotification(id));
  });
});



// Handles all errors
app.use((err, req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production") {
      console.log("Event Social logs", err);
      if (err.status === 412 || err.status === "412") {
        return res
          .status(err.status)
          .send({ status: false, message: err.message });
      }
      return res
        .status(err.status || 400)
        .send({ status: false, message: "An error occur: "+err.message });
    }
    console.log("Event Social logs", err);
    return res
      .status(err.status || 400)
      .send({ status: false, message: err.message });
  } catch (error) {
    return res
      .status(error.status || 400)
      .send({ status: false, message: error.message });
  }
});

// Not found route
app.use((req, res) => {
  return res.status(404).send({ status: false, message: "Route not found" });
});

// scheduler task and all
cron.schedule("* 6 * * *", () => {
   
  // if(shell.exec("node cronjob.js").code !== 0) {
  //     console.log("something went wrong");
  Promotion.findAll({
      where: { status: 1 }
  })
      .then(activePromotions => {
        // console.log(activePromotions);
        activePromotions.map(async promotion =>{
          if (promotion.expiredAt < moment()) {
            await Promotion.update({status: 0}, {where: {id: promotion.id}});
            console.log(`Promotion updated`);
          }
        })
        console.log(`No Promotion updated`);
      })
      .catch(error => {
          return null;
      });
  // }
});


const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=> console.log(`Server Started on PORT ${PORT}`));