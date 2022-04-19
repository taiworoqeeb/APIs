'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  };
  Transaction.init({
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
    description: {
      allowNull: true,
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Transaction',
    timestamps: true,
    paranoid: true,
    tableName: 'transactions',
  });
  // Transaction.sync({force: true})
  return Transaction;
};