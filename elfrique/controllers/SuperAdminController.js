require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateUniqueId = require("generate-unique-id");
const uniqueString = require("unique-string");
const nodemailer = require("nodemailer");
const User = require("../models").adminuser;
const ResetPasswords = require("../models").resetpassword;
const profile = require("../models").profile;
const SuperAdmin = require("../models").superadmin;
const VoteContestController = require("../controllers/VotingContest");

const AwardContestController = require("../controllers/AwardContest");

const EventController = require("../controllers/EventController");

const TicketController = require("../controllers/TicketController");

const TriviaController = require("../controllers/TriviaController");

const excludeAtrrbutes = { exclude: ["createdAt", "updatedAt", "deletedAt"] };

// imports initialization
const { Op } = require("sequelize");

exports.getAllUsers = async (req, res) => {
  try {
    const adminId = req.user.id;
    const superadmin = await SuperAdmin.findOne({
      where: {
        id: adminId,
      },
    });
    if (!superadmin) {
      return res.status(404).send({
        message: "SuperAdmin not found",
      });
    }

    const users = await User.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
      },
      include: [
        {
          model: profile,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    return res.status(200).send({
      users,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

exports.getAllContest = async (req, res) => {
  try {
    const adminId = req.user.id;
    const superadmin = await SuperAdmin.findOne({
      where: {
        id: adminId,
      },
    });
    if (!superadmin) {
      return res.status(404).send({
        message: "Only SuperAdmin can access this route",
      });
    }

    const contest = await VoteContestController.findAllVoteContest(req, res);

    return contest;
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const adminId = req.user.id;
    const superadmin = await SuperAdmin.findOne({
      where: {
        id: adminId,
      },
    });
    if (!superadmin) {
      return res.status(404).send({
        message: "Only SuperAdmin can access this route",
      });
    }

    const events = await EventController.findAllEvents(req, res);

    return events;
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};
