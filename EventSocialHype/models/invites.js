'use strict';
const {
  Model
} = require('sequelize');
const dayjs = require("dayjs");

module.exports = (sequelize, DataTypes) => {
  class Invitation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      // define association here
      
      Invitation.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      Invitation.belongsTo(models.Event, {
        foreignKey: "eventId",
        as: "event",
      });
    }

  }
  
  Invitation.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
    },
    userId: {
      allowNull: true,
      type: DataTypes.UUID,
    },
    eventId: {
      allowNull: true,
      type: DataTypes.UUID,
    },
    status: {
      allowNull: true,
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    
  }, {
    sequelize,
    modelName: 'Invitation',
    timestamps: true,
    paranoid: true,
    tableName: 'invitations',
  });
  // Invitation.sync({force: true})
  return Invitation;
};