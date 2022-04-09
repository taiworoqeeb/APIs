"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class adminuser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      adminuser.hasOne(models.profile);
      adminuser.hasMany(models.votingContest);
      adminuser.hasMany(models.awardContest);
      adminuser.hasMany(models.event);
      adminuser.hasMany(models.trivia);
      adminuser.hasMany(models.eventform);
      adminuser.hasMany(models.Referral, {
        foreignKey: "user_id",
        as: "ref_user",
      });

      adminuser.hasMany(models.Referral, {
        foreignKey: "referral_id",
        as: "referrer",
      });
    }
  }
  adminuser.init(
    {
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      phonenumber: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      referral_email: DataTypes.STRING,
      email_token: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      activated: {
        allowNull: true,
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
      reference: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      referral_id: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      role: {
        allowNull: false,
        type: DataTypes.ENUM("seller", "normalUser"),
        defaultValue: "normalUser",
      },
    },
    {
      sequelize,
      modelName: "adminuser",
    }
  );
  return adminuser;
};
