// package imports
const Sequelize = require("sequelize");
const moment = require('moment');

// local imports
const Users = require("../models").User;
const AdminMessages = require('../models').AdminMessage
const Admins = require('../models').Admin

// imports initialization
const Op = Sequelize.Op;

//admin message form
exports.adminMessage = (req,res)=>{
res.render('chatevery')
}


let timeFormats = [
    'D MMMM YYYY',
    'D MMMM YYYY HH:mm',
    'DD-MM-YY',
    'DD-MM-YYYY',
    'DD.MM.YYYY',
    'DD.MM.YYYY HH:mm',
    'DD/MM/YY',
    'DD/MM/YYYY',
    'DD/MM/YYYY HH:mm:ss',
    'HH:mm:ss',
    'M/D/YYYY',
    'D/M/YYYY',
    'MM-DD-YY',
    'MM-DD-YYYY',
    'MM-DD-YYYY HH:mm:ss',
    'MM/DD/YY',
    'MM/DD/YYYY',
    'MM/DD/YYYY HH:mm:ss',
    'MMM D YYYY',
    'MMM D YYYY LT',
    'MMMM Do YYYY',
    'MMMM Do YYYY LT',
    'YYYY-DD-MM HH:mm:ss',
    'YYYY-MM',
    'YYYY-MM-DD',
    'YYYY-MM-DD HH:mm',
    'YYYY-MM-DD HH:mm:ss',
    'YYYY-MM-DD LT',
    'YYYY-MM-DD h:mm:ss A',
    'YYYY-MM-DDTHH:mm:ssZ',
    'ddd, MMM D YYYY LT',
    'dddd D MMMM YYYY HH:mm',
    'dddd, MMMM Do YYYY LT'
];

exports.postAnnouncement = async(req, res) => {
    try {
        const {
            date,
            title,
            message
        } = req.body;
        if (!date || !message || !title) {
            req.flash("warning", "Enter all fields!");
            res.redirect("back");
            return
        } else if (!moment(new Date(date), timeFormats, true).isValid()) {
            req.flash("warning", "Enter a valid date!");
            res.redirect("back");
            return
        }
    
        await AdminMessages.create({
            adminId: req.session.adminId,
            expiredAt: moment(date).format('YYYY-MM-DD HH:mm:ss'),
            message: message,
            title: title
        });           
        req.flash("success", "Announcement created successfully!");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Server error. try again!: "+error);
        res.redirect("back");
    }
}

exports.viewAnnouncements = (req, res) => {
    AdminMessages.findAll({
            where: {
                deletedAt: {
                    [Op.eq]: null
                }
            },
            order: [
                ['createdAt', 'DESC'],
            ],
        })
        .then(announcements => {
                res.render("dashboards/view_announcements", {
                    announcements: announcements,
                    moment,
                });
        })
        .catch(error => {
            req.flash("error", "Server error. try again!");
            res.redirect("/dasboard");
        });
}

exports.deleteAnnouncement = async (req, res) =>{
    try {
        const {id} = req.body
        await AdminMessages.destroy({where: {id}});
        req.flash("success", "Announcement deleted Successfully");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Server error. try again!");
        res.redirect("back");
    }
}

//fetch all messages by admin
exports.allAdminMessages = (req, res, next) => {
    AdminMessages.findAll({where: {expiredAt: {
        [Op.gte]: moment().format('YYYY-MM-DD HH:mm:ss')
    }}})
        .then(messages => {
            return res.status(200).send({
                status: true,
                messages
            })
        }).catch(error=>{
            return res.status(500).send({
                status: false,
                message: "Server Error"
            })

        })
}
