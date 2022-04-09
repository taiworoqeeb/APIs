"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class triviaplayer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      triviaplayer.belongsTo(models.trivia, {
        foreignKey: "triviaId",
        as: "trivia",
      });
    }
  }
  triviaplayer.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
      },
      triviaId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      phonenumber: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      city: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      score: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      timeplayed: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "triviaplayer",
      timestamps: true,
      paranoid: true,
      tableName: "triviaplayers",
    }
  );
  return triviaplayer;
};
