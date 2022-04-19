const Sequelize = require('sequelize');

const Notification = require("../models").Notification;
const NotificationService = require("../helpers/notification");

exports.markNotificationAsRead = async(req, res) =>{
    try {
        const {id} = req.body;
        const notification = await Notification.findByPk(id);
        const {type, userId} = notification;
        await NotificationService.updateNotification(id);
        const { io } = req.app;
        if (type === 'admin') {
            io.emit("getNotifications", await NotificationService.fetchAdminNotification("admin"));
            
        }else if (type === 'user') {
            io.emit("getNotifications", await NotificationService.fetchUserNotification({userId}));
        }
        return res.status(200).send({
            status: true,
            message: "Notification read"
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error"
        })
    }
}

exports.getNotifications = async(req, res) =>{
    try {
        const userId = req.user.id;
        const notifications = await NotificationService.fetchUserNotification({ userId })
        
        return res.status(200).send({
            status: true,
            notifications
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error"
        })
    }
}

