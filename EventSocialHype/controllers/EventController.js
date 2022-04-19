require("dotenv").config();
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const jwt = require('jsonwebtoken');
const moment = require("moment");
const uniqueString = require("unique-string");
const sharp = require("sharp");
const path = require("path");

const User = require("../models").User;
const Event = require("../models").Event;
const EventImages = require("../models").EventImages;
const EventFilter = require("../models").EventFilter;
const EventTicket = require("../models").EventTicket;
const Comment = require("../models").Comment;
const Review = require("../models").Review;
const CommentReview = require("../models").CommentReview;
const Donation = require("../models").Donation;
const Invitation = require("../models").Invitation;
const Payment = require("../models").Payment;
const Transaction = require("../models").Transaction;
const Ticket = require("../models").Ticket;
const Promotion = require("../models").Promotion;
const EventMerchandise = require("../models").EventMerchandise;
const MerchandiseSale = require("../models").MerchandiseSale;
const Banner = require("../models").Banner;

const EmailService = require("../service/emailService");
const { ucfirst, getEventType } = require("../helpers");
const Notification = require("../helpers/notification");
const cloudinary = require("../helpers/cloudinary");
const Op = Sequelize.Op;


exports.createEvent = async (req, res) => {
    try {
        const id = req.user.id
        const { type } = req.body;
        const eventData = {
            type,
            userId: id,
            title: req.body.title,
            description: req.body.description,
            organizers: req.body.organizers,
            address: req.body.address,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            eventDate: req.body.eventDate,
            eventTime: req.body.eventTime,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
        };

        if (type === "invitation") {
            if (!req.body.slot ) {
                return res.status(400).send({
                    status: false,
                    message: "Please put total number of Invites"
                })
            }
            eventData.slot = req.body.slot;
        }

        const events = await Event.create(eventData);
        const { images } = req.body;
        const request = images.map(image => {
            return {
                image,
                eventId: events.id
            }
        });
        if (type === "ticket") {
            if (!req.body.tickets ) {
                return res.status(400).send({
                    status: false,
                    message: "Please Set up your ticket prices and names"
                })
            }
            const { tickets } = req.body;
            const eventTickets = tickets.map(ticket => {
                return {
                    name: ticket.name,
                    amount: ticket.amount,
                    eventId: events.id
                }
            });

            await EventTicket.bulkCreate(eventTickets);
        }
        await EventImages.bulkCreate(request);
        const user = await User.findByPk(id);
        const mesg = `An Event created by ${user.name} is waiting for approval`;
        const userId = id;
        
        const { io } = req.app;
        await Notification.createNotification({userId, type: "admin", message:mesg});
        io.emit("getNotifications", await Notification.fetchAdminNotification());
        return res.status(200).send({ status: true, message: "Event created Successfully" });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll({
            where: {
                approvalStatus: "approved",
                eventStatus: ["pending", "ongoing"],
                eventDate: { [Op.gte]: moment().format('YYYY-MM-DD HH:mm:ss') } 
            },
            order: [["createdAt", "DESC"]], include: [
                {
                    model: EventImages,
                    as: "event_images",
                    attributes: ["id", "image"]
                },
                {
                    model: User,
                    as: "owner",
                    attributes: ["id", "name", "role"]
                },
                {
                    model: EventTicket,
                    as: "event_tickets",
                    attributes: ["id", "name", "amount"]
                },
            ]
        });
        return res.status(200).send({
            status: true,
            data: events
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.getEventBasedOnType = async (req, res) => {
    try {
        const events = await Event.findAll({
            where: { 
                type: req.query.type,
                approvalStatus: "approved",
                eventStatus: ["pending", "ongoing"],
                eventDate: { [Op.gte]: moment().format('YYYY-MM-DD HH:mm:ss') }
            }, 
            order: [["createdAt", "DESC"]], include: [
                {
                    model: EventImages,
                    as: "event_images",
                    attributes: ["id", "image"]
                },
                {
                    model: User,
                    as: "owner",
                    attributes: ["id", "name", "role"]
                },
                {
                    model: EventTicket,
                    as: "event_tickets",
                    attributes: ["id", "name", "amount"]
                },
            ]
        });
        return res.status(200).send({
            status: true,
            data: events
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.getEventDetails = async (req, res) => {
    try {
        const events = await Event.findOne({
            where: { id: req.params.id }, order: [["createdAt", "DESC"]], include: [
                {
                    model: EventImages,
                    as: "event_images",
                    attributes: ["image", "id"]
                },
                {
                    model: User,
                    as: "owner",
                    attributes: ["id", "name", "role"]
                },
                {
                    model: EventTicket,
                    as: "event_tickets",
                    attributes: ["id", "name", "amount"]
                },
                {
                    model: Comment,
                    as: "comments",
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["id", "name", "username"]
                        }
                    ]
                },
            ]
        });
        if (!events) {
            return res.status(200).send({
                status: true,
                data: []
            });
        }
        const reviews = await Review.findAll({where:{eventId: events.id}});
        const sumReveiw = reviews.reduce((sum, review) =>{
            return sum + review.star
        }, 0);
        const review = sumReveiw/reviews.length;
        return res.status(200).send({
            status: true,
            data: events,
            ratings: review
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findOne({ where: { id: req.params.id } });
        if (!event) {
            return res.status(404).send({
                status: false,
                message: "Event Not Found"
            });
        } else if (event.userId !== req.user.id) {
            return res.status(400).send({
                status: false,
                message: "You can not delete Event that is created by another user"
            });
        }
        await event.destroy();
        return res.status(200).send({
            status: true,
            message: "Event Deleted Successfully"
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).send({
                status: false,
                message: "Event Not Found"
            });
        }else if (event.userId !== req.user.id) {
            return res.status(400).send({
                status: false,
                message: "You can not edit Event that is created by another user"
            });
        }
        await event.update(req.body);
        return res.status(200).send({
            status: true,
            message: "Event updated Successfully"
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.addRating = async (req, res) =>{
    try {
        const { eventId, star} = req.body;

        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).send({
                status: false,
                message: "Event Not Found"
            });
        }

        const request = {
            userId: req.user.id,
            eventId,
            star
        }
        await Review.create(request);
        const user = await User.findByPk(req.user.id);
        
        const { io } = req.app;
        const message = `${user.name} rated your event: ${event.title} ${star} star`;
        await Notification.createNotification({userId:event.userId, type: "user", message});
        const notifyParam = {
            userId: event.userId
        }
        io.emit("getUserNotifications", await Notification.fetchUserNotificationApi(notifyParam));
        return res.status(200).send({
            status: true,
            message: "Review added"
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.addCommentRating = async (req, res) =>{
    try {
        const { commentId, star} = req.body;

        const comment = await Comment.findOne({where:{id:commentId}, include:["event", "user"]});
        if (!comment) {
            return res.status(404).send({
                status: false,
                message: "Comment Not Found"
            });
        }

        const request = {
            userId: req.user.id,
            commentId,
            star
        }
        await CommentReview.create(request);
        const user = await User.findByPk(req.user.id);
        
        const { io } = req.app;
        const message = `${user.name} rated your comment ${star} star`;
        await Notification.createNotification({userId:comment.userId, type: "user", message});
        const notifyParam = {
            userId: comment.userId
        }
        io.emit("getUserNotifications", await Notification.fetchUserNotificationApi(notifyParam));
        return res.status(200).send({
            status: true,
            message: "Review added"
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.addComment = async (req, res) =>{
    try {
        const { eventId, comment} = req.body;

        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).send({
                status: false,
                message: "Event Not Found"
            });
        }
        const request = {
            userId: req.user.id,
            eventId,
            comment
        }
        await Comment.create(request);
        const user = await User.findByPk(req.user.id)

        const { io } = req.app;
        const message = `${user.name} commented on your event: ${event.title}`;
        await Notification.createNotification({userId:event.userId, type: "user", message});
        const notifyParam = {
            userId: event.userId
        }
        io.emit("getUserNotifications", await Notification.fetchUserNotificationApi(notifyParam));
        return res.status(200).send({
            status: true,
            message: "Comment added"
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.addDonation = async (req, res) =>{
    try {
        const { eventId, amount, method} = req.body;
        const userId = req.user.id

        const event = await Event.findByPk(eventId);
        const user = await User.findOne({where:{id:userId}});
        const eventOwner = await User.findByPk(event.userId);
        if (!event) {
            return res.status(404).send({
                status: false,
                message: "Event Not Found"
            });
        }
        if (method === "wallet") {
            const wallet = Number(user.wallet);
            if (wallet < amount) {
                return res.status(400).send({
                    status: false,
                    message: "You have insufficient amount in your wallet"
                });
            }
            const balance = wallet - amount;
            console.log('Balance', balance);
            await User.update({wallet:balance}, {where:{id:userId}});
            // Update event owner account and take charges
            const eventOwnerWallet = Number(eventOwner.wallet);
            const deductionAmount = (5/100)* amount;

            const addAmount = eventOwnerWallet + (amount-deductionAmount);
            await eventOwner.update({wallet: addAmount});
        }else if (method === "card") {
            const payment = {
                userId,
                payment_category: "Donation To Event",
                payment_reference: req.body.reference,
                amount
            }
            await Payment.create(payment);
            // Update event owner account and take charges
            const eventOwnerWallet = Number(eventOwner.wallet);
            const deductionAmount = (5/100)* amount;

            const addAmount = eventOwnerWallet + (amount-deductionAmount);
            await eventOwner.update({wallet: addAmount});
        }else if(method === "eHypeCurrency"){
            const eHypeCurrency = Number(user.eHypeCurrency);
            if (eHypeCurrency < amount) {
                return res.status(400).send({
                    status: false,
                    message: "You have insufficient amount in your E-Hype currency"
                });
            }
            const balance = eHypeCurrency - amount;
            console.log('Balance', balance);
            await User.update({eHypeCurrency:balance}, {where:{id:userId}});

            // Update event owner account and take charges
            const eventOwnerWallet = Number(eventOwner.eHypeCurrency);
            const deductionAmount = (5/100)* amount;

            const addAmount = eventOwnerWallet + (amount-deductionAmount);
            await eventOwner.update({eHypeCurrency: addAmount});
        }

        const message = `Donation made to ${event.title}`;
        const history = {
            userId: user.id,
            description: message,
            amount
        }

        await Transaction.create(history);
        const request = {
            userId,
            eventId,
            amount
        }
        await Donation.create(request);

        const { io } = req.app;
        const msg = `${user.name} made a Donation of ${amount} to your event: ${event.title}`;
        await Notification.createNotification({userId:event.userId, type: "user", message:msg});
        const notifyParam = {
            userId: event.userId
        }
        io.emit("getUserNotifications", await Notification.fetchUserNotificationApi(notifyParam));
        return res.status(200).send({
            status: true,
            message: "Donation added"
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.invitations = async (req, res) => {
    try {
        const {eventId} = req.params;
        const event = await Event.findByPk(eventId);

        if (!event) {
            return res.status(404).send({
                status: false,
                message: "Event Not Found"
            });
        }

        const invitations = await Invitation.findAll({where:{eventId}, include:[
            {
                model: User,
                as:"user",
                attributes: ["id", "name", "username"]
            },
        ]});

        return res.status(200).send({
            status: true,
            data: event,
            invitations
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.donations = async (req, res) => {
    try {
        const {eventId} = req.params;
        const event = await Event.findByPk(eventId);

        if (!event) {
            return res.status(404).send({
                status: false,
                message: "Event Not Found"
            });
        }

        const donations = await Donation.findAll({where:{eventId}, include:[
            {
                model: User,
                as:"user",
                attributes: ["name", "username"]
            }
        ]});

        return res.status(200).send({
            status: true,
            data: event,
            donations
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.getEventComments = async (req, res) => {
    try {
        const {eventId} = req.params;
        const event = await Event.findByPk(eventId);

        if (!event) {
            return res.status(404).send({
                status: false,
                message: "Event Not Found"
            });
        }

        const comments = await Comment.findAll({where:{eventId}, include:[
            {
                model: User,
                as:"user",
                attributes: ["name", "username"]
            },
            {
                model: CommentReview,
                as: "comments"
            }
        ]});

        return res.status(200).send({
            status: true,
            data: event,
            comments
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.getEventCommentRating = async (req, res) => {
    try {
        const {commentId} = req.params;
        const event = await Comment.findByPk(commentId);

        if (!event) {
            return res.status(404).send({
                status: false,
                message: "Comment Not Found"
            });
        }

        const reviews = await CommentReview.findAll({where:{commentId}});

        const sumReveiw = reviews.reduce((sum, review) =>{
            return sum + review.star
        }, 0);
        const review = sumReveiw/reviews.length;

        return res.status(200).send({
            status: true,
            comment: event,
            commentReview: reviews,
            rating: review
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}


exports.requestForInvite = async (req, res) =>{
    try {
        const {eventId} = req.body;
        const userId = req.user.id;
        const invite = await Invitation.findOne({where:{eventId, userId}});
        const event = await Event.findOne({where:{id: eventId}});
        const invitations = await Invitation.findAndCountAll({where:{eventId}});
       
        if (invitations.count >= Number(event.slot)) {
            return res.status(400).send({
                status: false,
                message: "Invitation Closed",
            });
        }else if (invite) {
            return res.status(200).send({
                status: true,
                message: 'Invitation Sent Wait for Event organizer acceptance'
            })
        }
        const request = {
            eventId,
            userId
        }

        await Invitation.create(request);
        const user = await User.findByPk(userId)

        const { io } = req.app;
        const msg = `${user.name} requested for an invite to your event: ${event.title}`;
        await Notification.createNotification({userId:event.userId, type: "user", message:msg});
        const notifyParam = {
            userId: event.userId
        }
        io.emit("getUserNotifications", await Notification.fetchUserNotificationApi(notifyParam));
        return res.status(200).send({
            status: true,
            message: 'Invitation Sent Wait for Event organizer acceptance'
        })

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.acceptInvite = async (req, res) => {
    try {
        const {eventId, inviteId, status} = req.body;
        const event = await Event.findOne({ where: { id: eventId } });
        const invite = await Invitation.findOne({where:{id: inviteId}, include:[
            {
                model: User,
                as:"user",
                attributes: ["name", "username", "email"]
            }
        ]})
        if (!event || !invite) {
            return res.status(404).send({
                status: false,
                message: "Event/Invite Not Found"
            });
        } else if (event.userId !== req.user.id) {
            return res.status(400).send({
                status: false,
                message: "Only the creator of this event can accept Invites"
            });
        }
        await invite.update({status});
        let inviteStatus = '';
        if (status === "approved") {
            inviteStatus = "Accepted";
            const eventDate = moment(event.eventDate).format("YYYY-MMM-DD");
            const email = invite.user.email;
            const name = invite.user.name;
            const title = event.title;
            const message = `
                    <p>Dear ${name},</p>
                    <p>Your Invites to ${title} has been accepted.</p>
                    <p>See You on ${eventDate}</p>
            `;
            const subject = `Your Invite to ${title} has been accepted`;
            EmailService.sendMail(email, message, subject);
        }

        let msg = "Invites Accepted";
        if (status === "rejected") {
            inviteStatus = "Declined";
            msg = "Invites declined"
        }
        const user = await User.findByPk(event.userId)

        const { io } = req.app;
        const msge = `${user.name} has ${inviteStatus} your request to event: ${event.title}`;
        await Notification.createNotification({userId:invite.userId, type: "user", message:msge});
        const notifyParam = {
            userId: invite.userId
        }
        io.emit("getUserNotifications", await Notification.fetchUserNotificationApi(notifyParam));
        
        return res.status(200).send({
            status: true,
            message: msg
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.purchaseEventTicket = async (req, res) =>{
    try {
        const { eventTicketId, method} = req.body;
        const userId = req.user.id
        const ticketNumber = uniqueString();

        const ticket = await EventTicket.findOne({where:{id:eventTicketId}, include:["tickets"]});
        const user = await User.findOne({where:{id:userId}});
        const amount = Number(ticket.amount);
        const eventOwner = await User.findByPk(ticket.tickets.userId);
        // return res.send({ticket, user})
        if (!ticket) {
            return res.status(404).send({
                status: false,
                message: "This Ticket is Not Recognised"
            });
        }else if (method === "wallet") {
            const wallet = Number(user.wallet);
            if (wallet < amount) {
                return res.status(400).send({
                    status: false,
                    message: "You have insufficient amount in your wallet"
                });
            }
            const balance = wallet - amount;
            console.log('Balance', balance);
            await User.update({wallet:balance}, {where:{id:userId}});
            // Update event owner account and take charges
            const eventOwnerWallet = Number(eventOwner.wallet);
            const deductionAmount = (6/100)* amount;

            const addAmount = eventOwnerWallet + (amount-deductionAmount);
            await eventOwner.update({wallet: addAmount});
        }else if (method === "card") {
            const payment = {
                userId,
                payment_category: "Purchase Event Ticket",
                payment_reference: req.body.reference,
                amount
            }
            await Payment.create(payment);

            // Update event owner account and take charges
            const eventOwnerWallet = Number(eventOwner.wallet);
            const deductionAmount = (6/100)* amount;

            const addAmount = eventOwnerWallet + (amount-deductionAmount);
            await eventOwner.update({wallet: addAmount});
        }else if(method === "eHypeCurrency"){
            const eHypeCurrency = Number(user.eHypeCurrency);
            console.log(amount, eHypeCurrency);
            if (eHypeCurrency < amount) {
                return res.status(400).send({
                    status: false,
                    message: "You have insufficient amount in your E-Hype currency"
                });
            }
            const balance = eHypeCurrency - amount;
            console.log('Balance', balance);
            await User.update({eHypeCurrency:balance}, {where:{id:userId}});

            // Update event owner account and take charges
            const eventOwnerWallet = Number(eventOwner.eHypeCurrency);
            const deductionAmount = (6/100)* amount;

            const addAmount = eventOwnerWallet + (amount-deductionAmount);
            await eventOwner.update({eHypeCurrency: addAmount});
        }

        const message = `Purchase ${ticket.name} Ticket for ${ticket.tickets.title}`;
        const history = {
            userId: user.id,
            description: message,
            amount
        }
    
        await Transaction.create(history);
        const request = {
            userId,
            eventTicketId,
            ticketNumber
        }
        await Ticket.create(request);
        
        const { io } = req.app;
        const msg = `${user.name} Purchase ${ticket.name} Ticket for event: ${ticket.tickets.title}`;
        await Notification.createNotification({userId:ticket.tickets.userId, type: "user", message:msg});
        const notifyParam = {
            userId: ticket.tickets.userId
        }
        io.emit("getUserNotifications", await Notification.fetchUserNotificationApi(notifyParam));
        return res.status(200).send({
            status: true,
            message: "Event Ticket Purchased"
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.ticketsPurchased = async (req, res) => {
    try {
        const {eventId} = req.params;
        const event = await Event.findByPk(eventId);
        const eventTickets = await EventTicket.findAll({where:{eventId}, include: [
            {
                model: Ticket,
                as: "boughtTickets",
                attributes: ["id", "ticketNumber", "eventTicketId"],
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "name", "username"]
                    }
                ]
            }
        ]});
        // return res.send({eventTickets})
        // const ticketIds = [...new Set(eventTickets.map(ticket => ticket.id))];

        // if (!event) {
        //     return res.status(404).send({
        //         status: false,
        //         message: "Event Not Found"
        //     });
        // }

        // const tickets = await Ticket.findAll({where:{eventTicketId: ticketIds}, include:[
        //     {
        //         model: EventTicket,
        //         as:"ticket_category",
        //         attributes: ["id", "name", "amount"]
        //     },
        //     {
        //         model: User,
        //         as:"user",
        //         attributes: ["id", "name", "username"]
        //     }
        // ]});

        return res.status(200).send({
            status: true,
            data: event,
            eventTickets
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.eventEngagements = async (req, res) => {
    try {
        const {eventId} = req.params;
        const event = await Event.findByPk(eventId);
        const donations = await Donation.findAll({where:{eventId}});
        const totalAmountDonated = donations.reduce((sum, donation) =>{
            return sum + donation.amount
        }, 0);
        const totalPeopleDonated = [...new Set(donations.map(donate =>donate.userId))];
        const comments = await Comment.findAll({where:{eventId}})
        const rating = await Review.findAll({where:{eventId}});
        const commentLength = comments.length === null ? 0 : comments.length;
        const ratingLength = rating.length === null ? 0 : rating.length;
        const commentReview = (commentLength + ratingLength) === null ? 0 : (comments.length + rating.length)

        const data = {
            event,
            donations: {
                totalPeopleDonated: totalPeopleDonated.length,
                totalAmountDonated
            },
            invitations: {
                totalInvite: 0,
                pendingInvite: 0,
                declinedInvite: 0,
                acceptedInvite: 0
            },
            eventViews: commentReview
        }

        if (!event) {
            return res.status(404).send({
                status: false,
                message: "Event Not Found"
            });
        }else if(event.type === "invitation") {
            const invites = await Invitation.findAll({where:{eventId}});
            const pendingInvites = invites.filter(inv => inv.status === "pending");
            const declinedInvite = invites.filter(inv => inv.status === "rejected");
            const approvedInvite = invites.filter(inv => inv.status === "approved");

            data.invitations.acceptedInvite = approvedInvite.length;
            data.invitations.pendingInvite = pendingInvites.length;
            data.invitations.declinedInvite = declinedInvite.length;
            data.invitations.totalInvite = invites.length;
            const views = commentReview + invites.length;
            data.eventViews = views

        }else if(event.type === "ticket") {
            const eventTickets = await EventTicket.findAll({where:{eventId}});
            const ticketIds = eventTickets.map(ticket => ticket.id);
            const tickets = await Ticket.findAll({where:{eventTicketId: ticketIds} });
            data.ticketsPurchased = tickets.length;
            const views = commentReview + tickets.length;
            data.eventViews = views

        }       

        return res.status(200).send({
            status: true,
            data
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.filterEvents = async (req, res) => {
    try {
        const events = await Event.findAll({
            where: { 
                event_status: req.query.status,
                approvalStatus: "approved",
                eventStatus: ["pending", "ongoing"],
                eventDate: { [Op.gte]: moment().format('YYYY-MM-DD HH:mm:ss') }
            
            }, order: [["createdAt", "DESC"]], include: [
                {
                    model: EventImages,
                    as: "event_images",
                    attributes: ["id", "image"]
                },
                {
                    model: User,
                    as: "owner",
                    attributes: ["id", "name", "role"]
                },
                {
                    model: EventTicket,
                    as: "event_tickets",
                    attributes: ["id", "name", "amount"]
                },
            ]
        });
        return res.status(200).send({
            status: true,
            data: events
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

// Admin
exports.allEvents = async (req, res, next) => {
    try {
        const { approvalStatus } = req.query;
        const events = await Event.findAll({ where: { 
            approvalStatus,
            eventDate: { [Op.gte]: moment().format('YYYY-MM-DD HH:mm:ss') } 
         }, include: ["owner"], order: [["createdAt", "DESC"]] });
        
        res.render("dashboards/all_events", {
            moment,
            events,
            ucfirst,
            approvalStatus,
            getEventType
        });
    } catch (error) {
        req.flash('error', "Server error! " + error);
        res.redirect("back");
    }
}

exports.adminEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const events = await Event.findOne({
            where: { id }, order: [["createdAt", "DESC"]], include: [
                {
                    model: EventImages,
                    as: "event_images",
                    attributes: ["image", "id"]
                },
                {
                    model: User,
                    as: "owner",
                    attributes: ["id", "name", "role"]
                },
                {
                    model: EventTicket,
                    as: "event_tickets",
                    attributes: ["id", "name", "amount"]
                },
                {
                    model: Donation,
                    as: "donations",
                },
                {
                    model: Comment,
                    as: "comments",
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["id", "name", "username"]
                        }
                    ]
                },
            ]
        });
        const images = events.event_images
        const reviews = await Review.findAll({where:{eventId: events.id}});
        const invites = await Invitation.findAll({where:{eventId: events.id}})
        const sumReveiw = reviews.reduce((sum, review) =>{
            return sum + review.star
        }, 0);
        console.log("reviewSum", sumReveiw);
        const review = sumReveiw/reviews.length;
        const donation = [...new Set(events.donations.map(don => don.userId))];
        const totalAmountDonated = events.donations.reduce((sum, donate) =>{
            return sum + donate.amount
        }, 0);
        const eventMerchandise = await EventMerchandise.findAll({where:{eventId: events.id}});
        const merchandise = eventMerchandise.length
        res.render("dashboards/event_details", {
            moment,
            events,
            ucfirst,
            review: reviews.length ==0 ? 0 : review,
            getEventType,
            images,
            donation,
            totalAmountDonated,
            invites,
            merchandise
        });
    } catch (error) {
        req.flash('error', "Server error! " + error);
        res.redirect("back");
    }
}

exports.approveEvent = (req, res, next) => {
    id = req.body.id;
    Event.findOne({
        where: {
            id: {
                [Op.eq]: id
            }
        },
    })
        .then(event => {
            if (event) {
                Event.update({
                    approvalStatus: "approved"
                }, {
                    where: {
                        id: {
                            [Op.eq]: id
                        }
                    }
                })
                    .then(async eve => {
                        const { io } = req.app;
                        const msge = `Admin has Approve your event to be listed: ${event.title}`;
                        await Notification.createNotification({userId:event.userId, type: "user", message:msge});
                        const notifyParam = {
                            userId: event.userId
                        }
                        io.emit("getUserNotifications", await Notification.fetchUserNotificationApi(notifyParam));
                        req.flash('success', "Event Approved successfully!");
                        res.redirect("back");
                    })
                    .catch(error => {
                        req.flash('error', "Server error!");
                        res.redirect("back");
                    });
            } else {
                req.flash('warning', "Invalid Event!");
                res.redirect("back");
            }
        })
        .catch(error => {
            req.flash('error', "Server error!");
            res.redirect("back");
        });
}

exports.disApproveEvent = (req, res, next) => {
    id = req.body.id;
    Event.findOne({
        where: {
            id: {
                [Op.eq]: id
            }
        },
    })
        .then(event => {
            if (event) {
                // fund the users account before anything
                Event.update({
                    approvalStatus: "disapproved"
                }, {
                    where: {
                        id: {
                            [Op.eq]: id
                        }
                    }
                })
                    .then(async eve => {
                        const { io } = req.app;
                        const msge = `Admin has Disapprove your event. Therefore it can't be listed: ${event.title}`;
                        await Notification.createNotification({userId:event.userId, type: "user", message:msge});
                        const notifyParam = {
                            userId: event.userId
                        }
                        io.emit("getUserNotifications", await Notification.fetchUserNotificationApi(notifyParam));
                        req.flash('success', "Event Disapproved successfully!");
                        res.redirect("back");
                    })
                    .catch(error => {
                        req.flash('error', "Server error!");
                        res.redirect("back");
                    });
            } else {
                req.flash('warning', "Event not found");
                res.redirect("back");
            }
        })
        .catch(error => {
            req.flash('error', "Server error!");
            res.redirect("back");
        });
}

exports.enableControl = async (req, res) => {
    try {
        const { id, type } = req.body
        console.log("enable button", req.body);
        const event = await Event.findByPk(id);
        let control = '';
        // return res.send(event)
        if (type === "donateBtn") {
            await Event.update({ donateBtn: false }, { where: { id } });
            control = "Donate Button"
        } else if (type === "commentBtn") {
            await Event.update({ commentBtn: false }, { where: { id } });
            control = "Comment Button"
        }

        const { io } = req.app;
        const msge = `Admin has Enable ${control} for event : ${event.title}`;
        await Notification.createNotification({userId:event.userId, type: "user", message:msge});
        const notifyParam = {
            userId: event.userId
        }
        io.emit("getUserNotifications", await Notification.fetchUserNotificationApi(notifyParam));

        return res.status(200).send({
            success: true,
            message: "Button Control Enabled Successfully",
            event
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Unable to update Control Button : " + error
        });
    }
}

exports.disableControl = async (req, res) => {
    try {
        const { id, type } = req.body
        console.log("disable button", req.body);
        const event = await Event.findByPk(id);
        let control = ''
        if (type === "donateBtn") {
            await Event.update({ donateBtn: true }, { where: { id } });
            control = "Donate Button"
        } else if (type === "commentBtn") {
            await Event.update({ commentBtn: true }, { where: { id } });
            control = "Comment Button"
        }
        const { io } = req.app;
        const msge = `Admin has Disable ${control} for event : ${event.title}`;
        await Notification.createNotification({userId:event.userId, type: "user", message:msge});
        const notifyParam = {
            userId: event.userId
        }
        io.emit("getUserNotifications", await Notification.fetchUserNotificationApi(notifyParam));

        return res.status(200).send({
            success: true,
            message: "Button Control Disabled Successfully",
            event
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Unable to update Control Button : " + error
        });
    }
}

exports.updateTrustScore = async (req, res) => {
    try {
        const { eventId, trustScore } = req.body
        // console.log( req.body);
        const event = await Event.findOne({ where: { id: eventId } });
        const oldScore = event.trustScore === null ? 0 : Number(event.trustScore)
        console.log("OldScore", oldScore);
        const newScore = oldScore + Number(trustScore)
        console.log("newScore", newScore);
        await Event.update({ trustScore: newScore }, { where: { id: eventId } });
        const { io } = req.app;
        const msge = `Admin has Added ${newScore} trust point for your event : ${event.title}`;
        await Notification.createNotification({userId:event.userId, type: "user", message:msge});
        const notifyParam = {
            userId: event.userId
        }
        io.emit("getUserNotifications", await Notification.fetchUserNotificationApi(notifyParam));

        req.flash('success', "Trust Score Added!");
        res.redirect("back");
    } catch (error) {
        req.flash('error', "Server error!");
        res.redirect("back");
    }
}

exports.cancelEvent = async(req, res) =>{
    try {
        const event = await Event.findOne({ where: { id: req.params.id } });
        if (!event) {
            return res.status(404).send({
                status: false,
                message: "Event Not Found"
            });
        } else if (event.userId !== req.user.id) {
            return res.status(400).send({
                status: false,
                message: "You can not cancel Event that is created by another user"
            });
        }
        await event.update({event_status: "cancelled"});
        const user = await User.findByPk(event.userId);
        const mesg = `An Event, ${event.title} created by ${user.name} has been cancelled`;
        const userId = event.userId;
        
        const { io } = req.app;
        await Notification.createNotification({userId, type: "admin", message:mesg});
        io.emit("getNotifications", await Notification.fetchAdminNotification());
        return res.status(200).send({
            status: true,
            message: "Event cancelled"
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.postponeEvent = async(req, res) =>{
    try {
        const event = await Event.findOne({ where: { id: req.params.id } });
        if (!event) {
            return res.status(404).send({
                status: false,
                message: "Event Not Found"
            });
        } else if (event.userId !== req.user.id) {
            return res.status(400).send({
                status: false,
                message: "You can not Postpone Event that is created by another user"
            });
        }
        await event.update({event_status: "postponed"});
        const user = await User.findByPk(event.userId);
        const mesg = `An Event, ${event.title} created by ${user.name} has been postponed`;
        const userId = event.userId;
        
        const { io } = req.app;
        await Notification.createNotification({userId, type: "admin", message:mesg});
        io.emit("getNotifications", await Notification.fetchAdminNotification());
        return res.status(200).send({
            status: true,
            message: "Event Postponed"
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.hottestEvent = async (req, res) => {
    try {
        const currentDate = moment();
        const weekStart = currentDate.clone().startOf("week");
        const weekEnd = currentDate.clone().endOf("week");
        // return res.send({weekStart, weekEnd})
        const events = await Event.findAll({
            where:{
                eventDate: {
                    [Op.gte]: weekStart,
                    [Op.lte]: weekEnd
                }
            },
            order: [["createdAt", "DESC"]], include: [
                {
                    model: EventImages,
                    as: "event_images",
                    attributes: ["id", "image"]
                },
                {
                    model: User,
                    as: "owner",
                    attributes: ["id", "name", "role"]
                },
                {
                    model: EventTicket,
                    as: "event_tickets",
                    attributes: ["id", "name", "amount"]
                },
            ]
        });
        return res.status(200).send({
            status: true,
            data: events
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.promotedEvents = async (req, res) => {
    try {
        const promotedEvents = await Promotion.findAll({
            where: {
                [Op.and]: [
                    {
                        expiredAt: {
                            [Op.gte]: moment().format('YYYY-MM-DD HH:mm:ss')
                        }
                    },
                    {
                        status: 1
                    }
                ]
            }
        });
        const eventIds = promotedEvents.map(promo => promo.eventId)
        const events = await Event.findAll({
            where:{
                id: eventIds
            },
            order: [["createdAt", "DESC"]], include: [
                {
                    model: EventImages,
                    as: "event_images",
                    attributes: ["id", "image"]
                },
                {
                    model: User,
                    as: "owner",
                    attributes: ["id", "name", "role"]
                },
                {
                    model: EventTicket,
                    as: "event_tickets",
                    attributes: ["id", "name", "amount"]
                },
            ]
        });
        return res.status(200).send({
            status: true,
            data: events
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.uploadFilter = async(req, res) =>{
    try {
        const { images, eventId } = req.body;
        const event = await Event.findByPk(eventId)
        const request = images.map(image => {
            return {
                image,
                eventId
            }
        });
        await EventFilter.bulkCreate(request);
        const mesg = `Filter was uploaded for Event, ${event.title}`;
        const userId = event.userId;
        
        const { io } = req.app;
        await Notification.createNotification({userId, type: "admin", message:mesg});
        io.emit("getNotifications", await Notification.fetchAdminNotification());
        return res.status(200).send({
            status: true,
            message: "Filter upload successfully"
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.eventFilters = async(req, res) =>{
    try {
        const { eventId } = req.params;
        const filters = await EventFilter.findAll({where:{eventId}});
        return res.status(200).send({
            status: true,
            eventFilters:filters
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.createMerchandise = async (req, res) =>{
    try {
        const { eventId, title, amount, image } = req.body;
        const event = await Event.findOne({ where: { id: eventId } });
        if (!event) {
            return res.status(404).send({
                status: false,
                message: "Event Not Found"
            });
        } else if (event.userId !== req.user.id) {
            return res.status(400).send({
                status: false,
                message: "You can not create merchandise for Event that is created by another user"
            });
        }
        const request = {
            title,
            eventId,
            amount,
            image
        }

        await EventMerchandise.create(request);
        
        return res.status(200).send({
            status: true,
            message: "Event Merchandise created Successfully"
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.getMerchandises = async (req, res) =>{
    try {
        const merchandises = await EventMerchandise.findAll({where:{eventId: req.params.eventId}});
        
        return res.status(200).send({
            status: true,
            data: merchandises
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.updateMerchandise = async (req, res) =>{
    try {
        const request = req.body;
        const merchandise = await EventMerchandise.findOne({where:{id: req.params.id}});
        if (!merchandise) {
            return res.status(404).send({
                status: false,
                message: "Event Not Found"
            });
        }
        await merchandise.update(request);
        return res.status(200).send({
            status: true,
            message: "Event Merchandise updated Successfully"
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.deleteMerchandise = async (req, res) =>{
    try {
        const merchandise = await EventMerchandise.findOne({where:{id: req.params.id}});
        const event = await Event.findOne({ where: { id: merchandise.eventId } });
        if (!merchandise) {
            return res.status(404).send({
                status: false,
                message: "Event Not Found"
            });
        } else if (event.userId !== req.user.id) {
            return res.status(400).send({
                status: false,
                message: "You can not delete merchandise for Event that is created by another user"
            });
        }
       
        await EventMerchandise.destroy({where:{id: req.params.id}});
        
        return res.status(200).send({
            status: true,
            message: "Event Merchandise deleted Successfully"
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.purchaseEventMerchandise = async (req, res) =>{
    try {
        const { merchandiseId, method} = req.body;
        const userId = req.user.id

        const merchandise = await EventMerchandise.findOne({where:{id:merchandiseId}});
        const event = await Event.findByPk(merchandise.eventId)
        const user = await User.findOne({where:{id:userId}});
        const amount = Number(merchandise.amount);

        const eventOwner = await User.findByPk(event.userId);
       
        
        // return res.send({ticket, user})
        if (!merchandise) {
            return res.status(404).send({
                status: false,
                message: "This Merchandise is Not Recognised"
            });
        }else if (method === "wallet") {
            const wallet = Number(user.wallet);
            if (wallet < amount) {
                return res.status(400).send({
                    status: false,
                    message: "You have insufficient amount in your wallet"
                });
            }
            const balance = wallet - amount;
            console.log('Balance', balance);
            await User.update({wallet:balance}, {where:{id:userId}});
            // Update event owner account and take charges
            const eventOwnerWallet = Number(eventOwner.wallet);
            const deductionAmount = (6/100)* amount;

            const addAmount = eventOwnerWallet + (amount-deductionAmount);
            await eventOwner.update({wallet: addAmount});
        }else if (method === "card") {
            const payment = {
                userId,
                payment_category: "Purchase Event Merchandise",
                payment_reference: req.body.reference,
                amount
            }
            await Payment.create(payment);
            // Update event owner account and take charges
            const eventOwnerWallet = Number(eventOwner.wallet);
            const deductionAmount = (6/100)* amount;

            const addAmount = eventOwnerWallet + (amount-deductionAmount);
            await eventOwner.update({wallet: addAmount});
        }else if(method === "eHypeCurrency"){
            const eHypeCurrency = Number(user.eHypeCurrency);
            if (eHypeCurrency < amount) {
                return res.status(400).send({
                    status: false,
                    message: "You have insufficient amount in your E-Hype currency"
                });
            }
            const balance = eHypeCurrency - amount;
            console.log('Balance', balance);
            await User.update({eHypeCurrency:balance}, {where:{id:userId}});

            // Update event owner account and take charges
            const eventOwnerWallet = Number(eventOwner.eHypeCurrency);
            const deductionAmount = (6/100)* amount;

            const addAmount = eventOwnerWallet + (amount-deductionAmount);
            await eventOwner.update({eHypeCurrency: addAmount});
        }
        const message = `Purchase ${merchandise.title} for ${event.title}`;
        const history = {
            userId: user.id,
            description: message,
            amount
        }
    
        await Transaction.create(history);
        const request = {
            userId,
            eventMerchandiseId: merchandiseId
        }
        await MerchandiseSale.create(request);
        

        const { io } = req.app;
        const msg = `${user.name} Purchase ${merchandise.title} for event: ${event.title}`;
        await Notification.createNotification({userId:event.userId, type: "user", message:msg});
        const notifyParam = {
            userId: event.userId
        }
        io.emit("getUserNotifications", await Notification.fetchUserNotificationApi(notifyParam));
        return res.status(200).send({
            status: true,
            message: "Event Merchandise Purchased"
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.viewAllMerchandise = async(req, res) =>{
    try {
        const merchandises = await EventMerchandise.findAll({where:{eventId: req.params.id}});
        res.render("dashboards/event_merchandise",{
            events:merchandises,
            moment
        });

    } catch (error) {
        req.flash('error', "Server error! " + error);
        res.redirect("back");
    }
}

exports.viewAllMerchandiseSales = async(req, res) =>{
    try {
        const merchandises = await EventMerchandise.findOne({where:{id: req.params.id}, include:[
            {
                model: MerchandiseSale,
                as: "sales",
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes:["username", "email","name"]
                    }
                ]
            }
        ]});
        const {sales} = merchandises
        res.render("dashboards/merchandise_sales",{
            events:merchandises,
            sales,
            moment
        });
        // return res.send(merchandises)

    } catch (error) {
        req.flash('error', "Server error! " + error);
        res.redirect("back");
    }
}

exports.viewAllBanners = async(req, res) =>{
    try {
        const banners = await Banner.findAll();
        res.render("dashboards/all_banners",{
            banners,
            moment
        });
        // return res.send(merchandises)

    } catch (error) {
        req.flash('error', "Server error! " + error);
        res.redirect("back");
    }
}

exports.createBanner = async(req, res) =>{
    try {
    
        res.render("dashboards/banner");
        // return res.send(merchandises)

    } catch (error) {
        req.flash('error', "Server error! " + error);
        res.redirect("back");
    }
}

exports.viewBanner = async(req, res) =>{
    try {
        const banner = await Banner.findOne({where:{id:req.params.id}})
        res.render("dashboards/view_banner", {
            banner,
            moment
        } );
        // return res.send(merchandises)

    } catch (error) {
        req.flash('error', "Server error! " + error);
        res.redirect("back");
    }
}

exports.addNewBanner = async(req, res) =>{
    try {
        const {title, expiredAt} = req.body;
        const {filename} = req.file
        
        const result = await cloudinary.uploader.upload(req.file.path, {
            eager: [
                {
                    width: 300,
                    height: 300,
                    crop: "scale"
                }
            ]
        });

        const docPath = result.eager[0].secure_url;
        const request = {
            title,
            expiredAt,
            image: docPath
        }
        await Banner.create(request);
        req.flash('success', "Banner Uploaded Succesfully");
        res.redirect("back");

    } catch (error) {
        req.flash('error', "Server error! " + error);
        res.redirect("back");
    }
}

exports.deleteBanner = async(req, res) =>{
    try {
        const {id} = req.body
        const banner = await Banner.findByPk(id);
        if (!banner) {
            req.flash('error', "Server error! " + error);
            res.redirect("back");
            return;
        }
        await Banner.destroy({where:{id}});
        req.flash('success', "Banner deleted Succesfully");
        res.redirect("back");

    } catch (error) {
        req.flash('error', "Server error! " + error);
        res.redirect("back");
    }
}

exports.getBanners = async(req, res) =>{
    try {
        const banners = await Banner.findAll({where: {expiredAt: {
            [Op.gte]: moment().format('YYYY-MM-DD HH:mm:ss')
        }}})
        return res.status(200).send({
            status: true,
            data: banners
        })

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.sendInviteReminder = async (req, res) =>{
    try {
        const {eventId} = req.body;
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(400).send({
                status: false,
                message: "Event not Found"
            });
        }
        const invitedPeople = await Invitation.findAll({where:{eventId, status:"approved"}, attributes:["userId"]});
        const userIds = [...new Set(invitedPeople.map(people => people.userId))];
        const users = await User.findAll({where:{id:userIds}});
        const { io } = req.app;
        const msg = `Reminder for Event ${event.title} taking place at ${event.address} on ${moment(event.eventDate).format("MMM DD, YYYY")}`;
        const subject = `${event.title} Reminder`;
        
        await Promise.all(users.map(async user =>{
            await Notification.createNotification({userId:user.userId, type: "user", message:msg});
            const notifyParam = {
                userId: user.userId
            }
            io.emit("getUserNotifications", await Notification.fetchUserNotificationApi(notifyParam));
            await EmailService.sendMail(user.email, msg, subject);
        }));

        return res.status(200).send({
            status: true,
            message: "Reminder Sent"
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        });
    }
}
exports.AdmindeleteEvent = async (req, res, next) => {
    try {
        const { EventId } = req.body
        await Event.destroy({ where: { id:EventId } });
        
        return res.send({
            success: true,
            message: "Event Deleted Successfully"
        })
    } catch (error) {
        return res.send({
            success: false,
            message: "Server Error: "+error
        })
    }
}
