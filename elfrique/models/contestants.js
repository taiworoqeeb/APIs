"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class contestants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      contestants.belongsTo(models.votingContest);
    }
  }
  contestants.init(
    {
      id: {
        allowNull: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
      },
      fullname: DataTypes.STRING,
      image: DataTypes.STRING,
      contestantnumber: DataTypes.STRING,
      about: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "contestants",
    }
  );
  return contestants;
};
