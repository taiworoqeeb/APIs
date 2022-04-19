// package imports
const Sequelize = require("sequelize");
const moment = require("moment");

// local imports
const Packages = require("../models").Package;
const Users = require("../models").User;
const Transaction = require('../models').Transaction;
const Event = require('../models').Event;
const Promotion = require('../models').Promotion;
const Notification = require("../helpers/notification");
const { isNumeric } = require("../helpers/index")
// imports initialization
const Op = Sequelize.Op;

exports.addPackage = (req, res, next) => {
    res.render("dashboards/add_packages", {
        edit: false,
        moment
    });
}

exports.promotionPlan = async(req, res) =>{
    try {
        const plans = await Packages.findAll();
        return res.status(200).send({
            status: true,
            plans
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.ViewAllactivePlan = (req, res, next) => {
    Chats.findAll()
       .then(unansweredChats => {
           Subscription.findAll({
                where:{status: 1},
                include:['user', 'plan'],
                order: [["createdAt", "DESC"]]
               })
               .then(plan => {
                   
                    res.render("dashboards/all_active_plan", {
                        plans: plan,
                        messages: unansweredChats,
                        moment
                    });
                   
               })
               .catch(error => {
                   res.redirect("back");
               });
       })
       .catch(error => {
           req.flash('error', "Server error!");
           res.redirect("back");
       });
}

exports.allSubscription = (req, res, next) => {
    Promotion.findAll({
        include:['user', 'plan', 'event'],
        order: [["createdAt", "DESC"]]
        })
        .then(plan => {
            res.render("dashboards/subscriptions_history", {
                plans: plan,
                moment
            });
            
        })
        .catch(error => {
            res.redirect("back");
            req.flash('error', "An Error occured: "+error);
        });
}

exports.subscriptionHistory = (req, res, next) => {
    AdminMessages.findAll()
       .then(unansweredChats => {
           Subscription.findAll({
                order:[["createdAt", "DESC"]],
                include:["user", "plan"]
               })
               .then(history => {
                   Users.findOne({
                       where:{
                           id : {
                               [Op.eq] : req.session.userId
                           }
                       }
                   }).then(user=>{
                       res.render("dashboards/users/subscription_history", {
                           history,
                           user,
                           messages: unansweredChats,
                           moment
                       });
                   }).catch(error=>{
                       res.redirect('back')
                   })
                   
               })
               .catch(error => {
                   res.redirect("back");
               });
       })
       .catch(error => {
           req.flash('error', "Server error!");
           res.redirect("back");
       });
}

exports.subscribeToPlan = async (req, res)=>{
    try {
        const {eventId, planId, type } = req.body;
        const userId = req.user.id

        const plan = await Packages.findOne({where:{id: planId}});
        const user = await Users.findOne({where: {id: userId}});
        const event = await Event.findByPk(eventId);
        const wallet = Number(user.wallet)
        const now = moment();
        const days = Number(plan.duration);
        const amount = Number(plan.price)
        
        var new_date = moment(now, "DD-MM-YYYY").add(days, 'days');
        if (amount > wallet) {
            return res.status(400).send({
                status: false,
                message: "Wallet Balance is low. Please deposit to donate"
            })
        }
        const request = {
            userId,
            packageId: planId,
            eventId,
            status: 1,
            promotion_type: type,
            expiredAt: new_date
        }
        if (type === "local_press" || type === "both") {
            request.name = req.body.name;
            request.email = req.body.email;
            request.mobile = req.body.mobile;
        }
        await Promotion.create(request);
        const balance = wallet - amount
        await Users.update({wallet:balance}, {where:{id: userId}});
        const description = `Made Payment for promtion of event, with plan ${plan.name}`
        const history = {
            userId: user.id,
            description: description,
            amount
        }

        await Transaction.create(history);

        const mesg = `${user.name} request promotion using package ${plan.name} for event, ${event.title}`;
        
        const { io } = req.app;
        await Notification.createNotification({userId, type: "admin", message:mesg});
        io.emit("getNotifications", await Notification.fetchAdminNotification());
        return res.status(200).send({status: true, message: "Promotion subscribed Sucessfully"});

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error"
        })
    }
}

exports.editPackage = (req, res, next) => {
    const id = req.params.id;
    Packages.findOne({
            where: {
                id: {
                    [Op.eq]: id
                }
            }
        })
        .then(package => {
            if (package) {
                res.render("dashboards/add_packages", {
                    edit: true,
                    package: package,
                    moment
                });
            } else {
                res.redirect("back");
            }
        })
        .catch(error => {
            res.redirect("back");
        });
}

exports.adminAllPackages = (req, res, next) => {
  
            Packages.findAll({
                    where: {
                        deletedAt: {
                            [Op.eq]: null
                        }
                    },
                    order: [
                        ['createdAt', 'ASC'],
                    ],
                })
                .then(packages => {
                    res.render("dashboards/packages_admin", {
                        packages: packages,
                        moment
                    });
                })
                .catch(error => {
                    res.redirect("/dashboard");
                    req.flash('error', "Package already has subscribers!: "+error);
                });
}

exports.deletePackage = (req, res, next) => {
    Promotion.findOne({
            where: {
                packageId: {
                    [Op.eq]: req.body.id
                }
            }
        })
        .then(investment => {
            console.log(investment);
            if (investment) {
                req.flash('warning', "Package already has subscribers!");
                res.redirect("back");
            } else {
                Packages.destroy({
                        where: {
                            id: {
                                [Op.eq]: req.body.id
                            }
                        }
                    })
                    .then(response => {
                        req.flash('success', "package deleted successfully");
                        res.redirect("back");
                    })
                    .catch(error => {
                        req.flash('error', "something went wrong");
                        res.redirect("back");
                    });
            }
        })
        .catch(error => {
            req.flash('error', "Server error!: "+error);
            res.redirect("back");
        });
}

exports.postAddPackage = (req, res, next) => {
    const {
        name,
        price,
        description,
        duration
    } = req.body;
    // check if any of them are empty
    if (!name || !price || !description || !duration) {
        req.flash('warning', "enter all fields");
        res.redirect("back");
    } else if (!isNumeric(price)) {
        req.flash('warning', "enter valid price(digits only)");
        res.redirect("back");
    } else if (!isNumeric(duration)) {
        req.flash('warning', "enter valid duration(digits only)");
        res.redirect("back");
    } else {
        Packages.findOne({
                where: {
                    name: {
                        [Op.eq]: req.body.name
                    }
                }
            })
            .then(package => {
                if (package) {
                    req.flash('warning', "name already exists");
                    res.redirect("back");
                } else {
                    Packages.create({
                        name,
                        price,
                        description,
                        duration
                        })
                        .then(packages => {
                            req.flash('success', "Package added successfully!");
                            res.redirect("back");
                        })
                        .catch(error => {
                            req.flash('error', "Something went wrong!");
                            res.redirect("back");
                        });
                }
            })
            .catch(error => {
                req.flash('error', "something went wrong");
                res.redirect("back");
            });
    }
}

exports.postUpdatePackage = (req, res, next) => {
    const {
        name,
        price,
        description,
        duration
    } = req.body;
    // check if any of them are empty
    if (!name || !price || !description || !duration) {
        req.flash('warning', "enter all fields");
        res.redirect("back");
    } else if (!isNumeric(price)) {
        req.flash('warning', "enter valid price(digits only)");
        res.redirect("back");
    } else if (!isNumeric(duration)) {
        req.flash('warning', "enter valid duration(digits only)");
        res.redirect("back");
    } else {
        Packages.findOne({
                where: {
                    id: {
                        [Op.eq]: req.body.id
                    }
                }
            })
            .then(package => {
                if (!package) {
                    req.flash('warning', "Invalid Package");
                    res.redirect("back");
                } else {
                    Packages.update({
                        name,
                        price,
                        description,
                        duration
                        }, {
                            where: {
                                id: {
                                    [Op.eq]: req.body.id
                                }
                            }
                        })
                        .then(packages => {
                            req.flash('success', "Package updated successfully!");
                            res.redirect("back");
                        })
                        .catch(error => {
                            req.flash('error', "Something went wrong!");
                            res.redirect("back");
                        });
                }
            })
            .catch(error => {
                req.flash('error', "something went wrong");
                res.redirect("back");
            });
    }
}