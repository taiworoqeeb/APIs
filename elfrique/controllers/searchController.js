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
const votingContest = require("../models").votingContest;
const awardContest = require("../models").awardContest;
const awardCategories = require("../models").awardCategories;
const awardNominees = require("../models").awardNominees;
const eventsTicket = require("../models").eventsTicket;
const EventForm = require("../models").eventform;
const FormQuestion = require("../models").formQuestion;
const FormOption = require("../models").formOption;
const Trivia = require("../models").trivia;

const excludeAtrrbutes = { exclude: ["createdAt", "updatedAt", "deletedAt"] };

// imports initialization
const { Op } = require("sequelize");

exports.searchKeyWord = async (req, res) => {
  try {
    const { product } = req.params;
    const searchword = req.query.keyword;

    if (product == "event") {
      const result = await Event.findAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${searchword}%`,
              },
            },
            {
              description: {
                [Op.like]: `%${searchword}%`,
              },
            },
            {
              venue: {
                [Op.like]: `%${searchword}%`,
              },
            },
            {
              startdate: {
                [Op.like]: `%${searchword}%`,
              },
            },
            {
              enddate: {
                [Op.like]: `%${searchword}%`,
              },
            },
          ],
        },
      });
      if (!result) {
        return res.status(404).send({
          message: "No Events found with this keyword",
        });
      }
      return res.status(200).send({
        result,
      });
    } else if (product == "voting") {
      const vote = await votingContest.findAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${searchword}%`,
              },
            },
            {
              startdate: {
                [Op.like]: `%${searchword}%`,
              },
            },
            {
              closedate: {
                [Op.like]: `%${searchword}%`,
              },
            },
          ],
        },
      });

      const award = await awardContest.findAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${searchword}%`,
              },
            },
            {
              startdate: {
                [Op.like]: `%${searchword}%`,
              },
            },
            {
              closedate: {
                [Op.like]: `%${searchword}%`,
              },
            },
          ],
        },
      });

      let result = [...vote, ...award];
      if (!result) {
        return res.status(404).send({
          message: "No Voting found with this keyword",
        });
      }
      return res.status(200).send({
        result,
      });
    } else if (product == "trivia") {
      const result = await Trivia.findAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${searchword}%`,
              },
            },
            {
              details: {
                [Op.like]: `%${searchword}%`,
              },
            },
          ],
        },
      });
      if (!result) {
        return res.status(404).send({
          message: "No Trivia found with this keyword",
        });
      }
      return res.status(200).send({
        result,
      });
    } else if (product == "form") {
      const result = await EventForm.findAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${searchword}%`,
              },
            },
            {
              description: {
                [Op.like]: `%${searchword}%`,
              },
            },
            {
              startdate: {
                [Op.like]: `%${searchword}%`,
              },
            },
            {
              closedate: {
                [Op.like]: `%${searchword}%`,
              },
            },
          ],
        },
      });
      if (!result) {
        return res.status(404).send({
          message: "No Form found with this keyword",
        });
      }
      return res.status(200).send({
        result,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Server Error",
    });
  }
};
