"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class formQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      formQuestion.belongsTo(models.eventform);
      formQuestion.hasMany(models.formOption);
    }
  }
  formQuestion.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      question: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      eventformId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "formQuestion",
      timestamps: true,
      paranoid: true,
      tableName: "formQuestions",
    }
  );
  return formQuestion;
};
