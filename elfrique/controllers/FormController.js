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
const votingContest = require("../models").votingcontest;
const awardContest = require("../models").awardContest;
const awardCategories = require("../models").awardCategories;
const awardNominees = require("../models").awardNominees;
const eventsTicket = require("../models").eventsTicket;
const EventForm = require("../models").eventform;
const FormQuestion = require("../models").formQuestion;
const FormOption = require("../models").formOption;

const excludeAtrrbutes = { exclude: ["createdAt", "updatedAt", "deletedAt"] };

// imports initialization
const { Op } = require("sequelize");
const cloudinary = require("../helpers/cloudinary");
const upload = require("../helpers/upload");

exports.createForm = async (req, res) => {
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.image = result.secure_url;
    }
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
    const form = await EventForm.create(req.body);
    return res.status(200).send({
      form,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.buildform = async (req, res) => {
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
    const form = await EventForm.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: FormQuestion,
          include: [
            {
              model: FormOption,
            },
          ],
        },
      ],
    });
    if (!form) {
      return res.status(404).send({
        message: "Form not found",
      });
    }

    const questionForm = {
      question: req.body.question,
      type: req.body.type,
      eventformId: req.params.id,
    };

    const question = await FormQuestion.create(questionForm);

    if (req.body.options) {
      const options = req.body.options.map((option) => {
        return {
          value: option,
          formQuestionId: question.id,
          eventformId: req.params.id,
        };
      });
      const formOptions = await FormOption.bulkCreate(options);
    }
    return res.status(200).send({
      form,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getFormByUser = async (req, res) => {
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
    const form = await EventForm.findAll({
      where: { adminuserId },
      include: [
        {
          model: FormQuestion,
          include: [
            {
              model: FormOption,
            },
          ],
        },
      ],
    });
    if (!form) {
      return res.status(404).send({
        message: "Form not found",
      });
    }
    return res.status(200).send({
      form,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getForm = async (req, res) => {
  try {
    const form = await EventForm.findOne({
      where: { id: req.params.id },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: FormQuestion,
          order: [["createdAt", "ASC"]],
          include: [
            {
              model: FormOption,
            },
          ],
        },
        {
          model: User,
          include: [
            {
              model: Profile,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
            },
          ],
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    if (!form) {
      return res.status(404).send({
        message: "Form not found",
      });
    }
    return res.status(200).send({
      form,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.findAllForms = async (req, res) => {
  try {
    const form = await EventForm.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: FormQuestion,
          order: [["createdAt", "ASC"]],
          include: [
            {
              model: FormOption,
            },
          ],
        },
      ],
    });
    if (!form) {
      return res.status(404).send({
        message: "Form not found",
      });
    }
    return res.status(200).send({
      form,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};
