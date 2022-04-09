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

exports.createAwardContest = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const adminuserId = req.user.id;
    req.body.adminuserId = adminuserId;
    req.body.image = result.secure_url;
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
    const awards = await awardContest.create(req.body);
    return res.status(200).send({
      awards,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getAllAwardsContest = async (req, res) => {
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
    const awards = await awardContest.findAll({
      where: { adminuserId },
    });
    return res.status(200).send({
      awards,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getSingleAwardContest = async (req, res) => {
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
    const awards = await awardContest.findOne({
      where: { id: req.params.id },
    });
    return res.status(200).send({
      awards,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.updateAwardContest = async (req, res) => {
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
    const awards = await awardContest.findOne({
      where: { id: req.params.id },
    });
    if (!awards) {
      return res.status(404).send({
        message: "AwardContest not found",
      });
    }
    await awardContest.update(req.body);
    return res.status(200).send({
      awardContest,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.deleteAwardContest = async (req, res) => {
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
    const awards = await awardContest.findOne({
      where: { id: req.params.id },
    });
    if (!awards) {
      return res.status(404).send({
        message: "AwardContest not found",
      });
    }
    await awardContest.destroy();
    return res.status(200).send({
      message: "AwardContest deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.createAwardCategories = async (req, res) => {
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
    const awards = await awardContest.findOne({
      where: { id: req.params.id },
    });
    if (!awards) {
      return res.status(404).send({
        message: "AwardContest not found",
      });
    }
    req.body.awardContestId = awards.id;
    const Categories = await awardCategories.create(req.body);
    return res.status(200).send({
      Categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};
exports.getAllAwardCategories = async (req, res) => {
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
    const awards = await awardContest.findOne({
      where: { id: req.params.id },
    });
    if (!awards) {
      return res.status(404).send({
        message: "AwardContest not found",
      });
    }
    const Categories = await awardCategories.findAll({
      where: { awardContestId: awards.id },
    });
    return res.status(200).send({
      Categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getSingleCategory = async (req, res) => {
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
    const awards = await awardContest.findOne({
      where: { title: req.params.title },
    });
    if (!awards) {
      return res.status(404).send({
        message: "AwardContest not found",
      });
    }
    const Categories = await awardCategories.findOne({
      where: { id: req.params.id },
    });
    return res.status(200).send({
      Categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.createAwardNominees = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const adminuserId = req.user.id;
    //req.body.adminuserId = adminuserId;
    req.body.image = result.secure_url;
    //const adminuserId = req.user.id;
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
    const awards = await awardContest.findOne({
      where: { title: req.params.title },
    });
    if (!awards) {
      return res.status(404).send({
        message: "AwardContest not found",
      });
    }
    //console.log(awards);
    req.body.awardContestId = awards.id;
    const Categories = await awardCategories.findOne({
      where: { id: req.params.id },
    });
    if (!Categories) {
      return res.status(404).send({
        message: "AwardCategories not found",
      });
    }
    req.body.awardCategoriesId = Categories.id; //check this
    const Nominees = await awardNominees.create(req.body);
    return res.status(200).send({
      Nominees,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.findAllAwards = async (req, res) => {
  try {
    const awards = await awardContest.findAll({
      include: [
        {
          model: awardCategories,
          include: [
            {
              model: awardNominees,
              as: "nominees",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },

        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    return res.status(200).send({
      awards,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};
