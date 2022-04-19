'use strict';
const {
  Model
} = require('sequelize');
const dayjs = require("dayjs");
module.exports = (sequelize, DataTypes) => {
  class Deposit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Deposit.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  };
  Deposit.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
    },
    userId: {
      allowNull: true,
      type: DataTypes.UUID,
    },
    amount: {
      allowNull: true,
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    reference: {
      allowNull: true,
      type: DataTypes.STRING
    },
    
  }, {
    sequelize,
    modelName: 'Deposit',
    timestamps: true,
    paranoid: true,
    tableName: 'deposits',
  });
  // Deposit.sync({force: true})
  return Deposit;
};