"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class eventsTicket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      eventsTicket.belongsTo(models.event);
    }
  }
  eventsTicket.init(
    {
      name: DataTypes.STRING,
      quantity: DataTypes.STRING,
      price: DataTypes.STRING,
      salesstart: DataTypes.DATE,
      salesend: DataTypes.DATE,
      eventname: DataTypes.STRING,
      booked: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "eventsTicket",
    }
  );
  return eventsTicket;
};
