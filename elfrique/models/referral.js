"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Referral extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Referral.belongsTo(models.adminuser, {
        foreignKey: "user_id",
        as: "user",
      });

      Referral.belongsTo(models.adminuser, {
        foreignKey: "referral_id",
        as: "referralID",
      });
    }
  }
  Referral.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
      },
      referral_id: {
        allowNull: true,
        type: DataTypes.UUID,
      },
      user_id: {
        allowNull: true,
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      modelName: "Referral",
      timestamps: true,
      paranoid: true,
      tableName: "referrals",
    }
  );
  return Referral;
};
