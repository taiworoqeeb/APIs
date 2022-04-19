'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventTicket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      EventTicket.belongsTo(models.Event, {
        foreignKey: "eventId",
        as: "tickets",
      });

      EventTicket.hasMany(models.Ticket, {
        foreignKey: "eventTicketId",
        as: "boughtTickets",
      });
      
    }
    
    
  };
  EventTicket.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    eventId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    name: {
      allowNull: true,
      type: DataTypes.STRING
    },
    amount: {
      allowNull: true,
      type: DataTypes.FLOAT
    },
  }, {
    sequelize,
    modelName: 'EventTicket',
    timestamps: true,
    paranoid: true,
    tableName: 'event_tickets',
  });
  // EventTicket.sync({force: true})
  return EventTicket;
};