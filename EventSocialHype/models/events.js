'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Event.belongsTo(models.User, {
        foreignKey: "userId",
        as: "owner",
      });
      Event.hasMany(models.EventImages, {
        foreignKey: "eventId",
        as: "event_images"
      });
      Event.hasMany(models.EventTicket, {
        foreignKey: "eventId",
        as: "event_tickets"
      });
      Event.hasMany(models.Comment, {
        foreignKey: "eventId",
        as: "comments"
      });
      Event.hasMany(models.Review, {
        foreignKey: "eventId",
        as: "reviews"
      });
      Event.hasMany(models.Donation, {
        foreignKey: "eventId",
        as: "donations"
      });
      Event.hasMany(models.Invitation, {
        foreignKey: "eventId",
        as: "invitations"
      });
    }
    
    
  };
  Event.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    type: {
      allowNull: true,
      type: DataTypes.ENUM("open", "invitation", "ticket")
    },
    title: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    description: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    organizers: {
      allowNull: true,
      type: DataTypes.STRING
    },
    slot: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    address: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    city: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    state: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    country: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    eventDate: {
      allowNull: true,
      type: DataTypes.DATE
    },
    eventTime: {
      allowNull: true,
      type: DataTypes.STRING
    },
    approvalStatus: {
      allowNull: true,
      type: DataTypes.ENUM("pending", "draft", "approved", "disapproved"),
      defaultValue: "pending"
    },
    eventStatus: {
      allowNull: true,
      type: DataTypes.ENUM("pending", "draft",  "ongoing", "completed"),
      defaultValue: "pending"
    },
    totalAmount: {
      allowNull: true,
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    trustScore: {
      allowNull: true,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    investBtn: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    donateBtn: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    commentBtn: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    event_status:{
      type: DataTypes.ENUM("ongoing", "upcoming", "postponed", "cancelled"),
      allowNull: true,
      defaultValue: "upcoming"
    },
    latitude: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    longitude: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    contact_organizer: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    get_direction: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    request_invite: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    donate: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'Event',
    timestamps: true,
    paranoid: true,
    tableName: 'events',
  });
  // Event.sync({force: true})
  return Event;
};