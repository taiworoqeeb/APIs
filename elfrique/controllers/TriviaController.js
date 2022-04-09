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
const Trivia = require("../models").trivia;
const Question = require("../models").question;
const Options = require("../models").questionOption;
const Player = require("../models").triviaplayer;

const excludeAtrrbutes = { exclude: ["createdAt", "updatedAt", "deletedAt"] };

// imports initialization
const { Op } = require("sequelize");
const cloudinary = require("../helpers/cloudinary");
const upload = require("../helpers/upload");

exports.createTrivia = async (req, res) => {
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

    const trivia = await Trivia.create(req.body);

    return res.status(200).send({
      trivia,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getAllTrivia = async (req, res) => {
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
    const trivia = await Trivia.findAll({
      where: { adminuserId },
      include: [
        {
          model: Question,
          as: "questions",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
          include: [
            {
              model: Options,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
            },
          ],
        },
      ],
    });
    return res.status(200).send({
      trivia,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.addQuestion = async (req, res) => {
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
    const trivia = await Trivia.findOne({
      where: { adminuserId, id: req.params.id },
      include: [
        {
          model: Question,
          as: "questions",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
          include: [
            {
              model: Options,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
            },
          ],
        },
      ],
    });
    if (!trivia) {
      return res.status(404).send({
        message: "Trivia not found",
      });
    }
    console.log(req.body);
    let request = {
      question: req.body.questionDetails.question,
      nature: req.body.questionDetails.nature,
      answer: req.body.questionDetails.answer,
      image: req.body.image,
      triviaId: req.params.id,
    };
    const question = await Question.create(request);

    const { options } = req.body;
    options.forEach(async (option) => {
      let request = {
        option: option,
        questionId: question.id,
        triviaId: req.params.id,
      };
      await Options.create(request);
    });

    return res.status(200).send({
      message: "Question added successfully",
      question,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.updateQuestions = async (req, res) => {
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

    const { question } = req.body;
    const { options } = req.body;

    const questionUpdate = await Question.update(question, req.body.image, {
      where: { id: req.params.id },
    });

    for (let i = 0; i < options.length; i++) {
      const optionUpdate = await Options.update(options, {
        where: { questionId: req.params.id, id: options[i].id },
      });
    }
    return res.status(200).send({
      message: "Question updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.findAllTrivias = async (req, res) => {
  try {
    const trivias = await Trivia.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Question,
          as: "questions",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
          include: [
            {
              model: Options,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
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
    return res.status(200).send({
      trivias,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.addTriviaPlayer = async (req, res) => {
  try {
    const trivia = await Trivia.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Question,
          as: "questions",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
          include: [
            {
              model: Options,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
            },
          ],
        },
      ],
    });
    if (!trivia) {
      return res.status(404).send({
        message: "Trivia not found",
      });
    }
    const player = await Player.findOne({
      where: { email: req.body.email, triviaId: req.params.id },
    });
    if (!player) {
      newPlayer = await Player.create({
        email: req.body.email,
        name: req.body.name,
        score: 0,
        triviaId: req.params.id,
        timeplayed: 0,
        city: req.body.city,
        phonenumber: req.body.phonenumber,
      });

      return res.status(200).send({
        message: "Player added successfully",
        player: newPlayer,
      });
    } else {
      return res.status(200).send({
        message: "Player already exists",
        player: player,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getSingleTrivia = async (req, res) => {
  try {
    const trivia = await Trivia.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Question,
          as: "questions",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
          include: [
            {
              model: Options,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
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
    if (!trivia) {
      return res.status(404).send({
        message: "Trivia not found",
      });
    }
    return res.status(200).send({
      trivia,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};
