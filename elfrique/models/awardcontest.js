"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class awardContest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      awardContest.belongsTo(models.adminuser);
      awardContest.hasMany(models.contestInfo);
      awardContest.hasMany(models.sponsors);
      awardContest.hasMany(models.awardCategories);
      awardContest.hasMany(models.awardNominees);
    }
  }
  awardContest.init(
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
      categories: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "awardContest",
    }
  );
  return awardContest;
};
