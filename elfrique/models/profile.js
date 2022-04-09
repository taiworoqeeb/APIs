"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      profile.belongsTo(models.adminuser);
    }
  }
  profile.init(
    {
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      phonenumber: DataTypes.STRING,
      email: DataTypes.STRING,
      accountnumber: DataTypes.STRING,
      accountname: DataTypes.STRING,
      about: DataTypes.TEXT,
      bankname: DataTypes.STRING,
      gender: DataTypes.STRING,
      twitterURL: DataTypes.STRING,
      facebookURL: DataTypes.STRING,
      instagramURL: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "profile",
    }
  );
  return profile;
};
