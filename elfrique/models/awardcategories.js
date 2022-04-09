"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class awardCategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      awardCategories.belongsTo(models.awardContest);
      awardCategories.hasMany(models.awardNominees, {
        foreignKey: "awardCategoriesId",
        as: "nominees",
      });
    }
  }
  awardCategories.init(
    {
      id: {
        allowNull: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "awardCategories",
    }
  );
  return awardCategories;
};
