"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class trivia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      trivia.belongsTo(models.adminuser);
      trivia.hasMany(models.question, {
        foreignKey: "triviaId",
        as: "questions",
      });
      trivia.hasMany(models.questionOption, {
        foreignKey: "triviaId",
        as: "options",
      });
      trivia.hasMany(models.triviaplayer, {
        foreignKey: "triviaId",
        as: "players",
      });
    }
  }
  trivia.init(
    {
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      instruction: DataTypes.TEXT,
      duration: { type: DataTypes.STRING, allowNull: true },
      type: {
        allowNull: false,
        type: DataTypes.ENUM("free", "paid"),
        defaultValue: "free",
      },
      numberoftimes: {
        allowNull: false,
        type: DataTypes.ENUM("once", "unlimited"),
        defaultValue: "unlimited",
      },
    },
    {
      sequelize,
      modelName: "trivia",
    }
  );
  return trivia;
};
