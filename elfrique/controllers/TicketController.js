require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateUniqueId = require("generate-unique-id");
const uniqueString = require("unique-string");
const nodemailer = require("nodemailer");
//const sequelize = require("../config/db");
const User = require("../models").adminuser;
const ResetPasswords = require("../models").resetpassword;
const Profile = require("../models").profile;
const Event = require("../models").event;
const Ticket = require("../models").eventsTicket;
const votingContest = require("../models").votingcontest;
const awardContest = require("../models").awardContest;
const awardCategories = require("../models").awardCategories;
const awardNominees = require("../models").awardNominees;

const excludeAtrrbutes = { exclude: ["createdAt", "updatedAt", "deletedAt"] };

// imports initialization
const { Op } = require("sequelize");
const cloudinary = require("../helpers/cloudinary");
const upload = require("../helpers/upload");

//controllers

exports.createTickets = async (req, res) => {
  try {
    const adminuserId = req.user.id;
    req.body.adminuserId = adminuserId;
    const profile = await Profile.findOne({
      where: { adminuserId },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    if (!profile) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const event = await Event.findOne({
      where: {
        adminuserId,
        id: req.params.id,
      },
    });
    if (!event) {
      return res.status(404).send({
        message: "Event not found",
      });
    }
    req.body.eventId = event.id;
    const tickets = await Ticket.create(req.body);
    return res.status(200).send({
      tickets,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getAllTicketsById = async (req, res) => {
  try {
    const adminuserId = req.user.id;
    const profile = await Profile.findOne({
      where: { adminuserId },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    if (!profile) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const tickets = await Ticket.findAll({
      where: {
        eventId: req.params.id,
      },
    });
    return res.status(200).send({
      tickets,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};
