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

const excludeAtrrbutes = { exclude: ["createdAt", "updatedAt", "deletedAt"] };

// imports initialization
const { Op } = require("sequelize");

exports.getUserProfile = async (req, res) => {
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
    return res.status(200).send({
      profile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.editUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      include: [
        {
          model: Profile,
          as: "profile",
          attributes: excludeAtrrbutes,
        },
      ],
    });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    //const { firstname, lastname, phonenumber, email, accountnumber, accountname, about, bankname,gender,twitterURL,facebookURL,instagramURL } = req.body
    /* const newProfile = await Profile.update(req.body, {
      where: {
        id: user.id,
      },
    }); */

    const profile = await Profile.findOne({
      where: { adminuserId: req.user.id },
    });

    await profile.update(req.body);
    return res.status(200).send({
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.changePassWord = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      include: [
        {
          model: Profile,
          as: "profile",
          attributes: excludeAtrrbutes,
        },
      ],
    });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const { oldPassword, newPassword } = req.body;
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).send({
        message: "Incorrect password",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await user.update({
      password: hashedPassword,
    });
    return res.status(200).send({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.becomeASeller = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      include: [
        {
          model: Profile,
          as: "profile",
          attributes: excludeAtrrbutes,
        },
      ],
    });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const newProfile = await Profile.update(req.body, {
      where: {
        adminuserId: {
          [Op.eq]: req.user.id,
        },
      },
    });

    await user.update({
      role: "seller",
    });
    return res.status(200).send({
      status: "success",
      message: "You are now a seller",
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};
