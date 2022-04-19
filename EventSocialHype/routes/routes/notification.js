const express = require('express');
const NotificationController = require("../../controllers/NotificationController");
const Auth = require("../../middlewares/Auth");

const router = express.Router();

router.post("/notification/read", NotificationController.markNotificationAsRead);

router.get("/notification", Auth, NotificationController.getNotifications);



module.exports = router;