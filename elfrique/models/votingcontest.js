"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class votingContest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      votingContest.belongsTo(models.adminuser);
      votingContest.hasMany(models.contestants);
      votingContest.hasMany(models.contestInfo);
      votingContest.hasMany(models.sponsors);
    }
  }
  votingContest.init(
    {
      id: {
        allowNull: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
      },
      title: DataTypes.STRING,
      type: DataTypes.STRING,
      votelimit: DataTypes.STRING,
      startdate: DataTypes.STRING,
      closedate: DataTypes.STRING,
      timezone: DataTypes.STRING,
      paymentgateway: DataTypes.STRING,
      fee: DataTypes.STRING,
      packagestatus: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "votingContest",
    }
  );
  return votingContest;
};
