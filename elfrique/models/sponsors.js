"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class sponsors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      sponsors.belongsTo(models.votingContest);
      sponsors.belongsTo(models.awardContest);
    }
  }
  sponsors.init(
    {
      id: {
        allowNull: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
      },
      fullname: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "sponsors",
    }
  );
  return sponsors;
};
