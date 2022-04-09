"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      question.belongsTo(models.trivia, {
        foreignKey: "triviaId",
        as: "trivia",
      });
      question.hasMany(models.questionOption);
    }
  }
  question.init(
    {
      question: DataTypes.TEXT,
      image: DataTypes.STRING,
      nature: DataTypes.STRING,
      answer: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "question",
      imestamps: true,
      paranoid: true,
    }
  );
  return question;
};
