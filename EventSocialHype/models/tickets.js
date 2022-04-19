'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Ticket.belongsTo(models.EventTicket, {
        foreignKey: "eventTicketId",
        as: "ticket_category",
      });

      Ticket.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      
    }
    
    
  };
  Ticket.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    eventTicketId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    ticketNumber: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Ticket',
    timestamps: true,
    paranoid: true,
    tableName: 'tickets',
  });
  // Ticket.sync({force: true})
  return Ticket;
};