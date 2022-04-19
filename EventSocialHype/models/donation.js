'use strict';
const {
  Model
} = require('sequelize');
const dayjs = require("dayjs");

module.exports = (sequelize, DataTypes) => {
  class Donation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      // define association here
      
      Donation.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }

  }
  
  Donation.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
    },
    userId: {
      allowNull: true,
      type: DataTypes.UUID
    },
    eventId: {
      allowNull: true,
      type: DataTypes.UUID,
    },
    amount: {
      allowNull: true,
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    
  }, {
    sequelize,
    modelName: 'Donation',
    timestamps: true,
    paranoid: true,
    tableName: 'donations',
  });
  // Donation.sync({force: true})
  return Donation;
};