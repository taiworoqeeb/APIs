// package imports
const Sequelize = require("sequelize");
const moment = require("moment");

// local imports

const Users = require("../models").User;
const Admins = require('../models').Admin;
const Event = require('../models').Event;

// imports initialization
const Op = Sequelize.Op;

exports.AdminHome = async (req, res, next) => {
    try {
        const user = await Users.findAll();
        const verifiedUser = await Users.findAll({where:{activated:1}});
        let usersCount = user.length;
        const admins = await Admins.findAll();
        let adminCount = admins.length;
        const events = await Event.findAll({ where: { eventDate: { [Op.gte]: moment().format('YYYY-MM-DD HH:mm:ss') }, approvalStatus: { [Op.ne]: "draft" } } });
        const upcomingEvent = events.filter(event => event.event_status === 'upcoming');
        const postponedEvent = events.filter(event => event.event_status === 'postponed');
        const ongoingEvent = events.filter(event => event.event_status === 'ongoing');
        const cancelledEvent = events.filter(event => event.event_status === 'cancelled');
        const pendingEvent = events.filter(event => event.approvalStatus === 'pending');
        const approvedEvent = events.filter(event => event.approvalStatus === 'approved');
        res.render("dashboards/home", {
            usersCount: usersCount,
            adminCount: adminCount,
            activeUsersCount: verifiedUser.length,
            users: user,
            moment,
            upcomingEvent: upcomingEvent.length,
            postponedEvent: postponedEvent.length,
            ongoingEvent: ongoingEvent.length,
            cancelledEvent: cancelledEvent.length,
            pendingEvent: pendingEvent.length,
            approvedEvent: approvedEvent.length,

        })
    } catch (err) {
        res.redirect("/admin")
    }
}

exports.adminPassword = (req, res, next) => {
    res.render("dashboards/change_password");
}
