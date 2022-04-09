"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      event.belongsTo(models.adminuser);
      event.hasMany(models.eventsTicket);
    }
  }
  event.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: DataTypes.STRING,
      country: DataTypes.STRING,
      state: DataTypes.STRING,
      city: DataTypes.STRING,
      venue: DataTypes.STRING,
      startdate: DataTypes.DATE,
      enddate: DataTypes.STRING,
      image: DataTypes.STRING,
      description: DataTypes.STRING,
      organisation: DataTypes.STRING,
      paymentgateway: DataTypes.STRING,
      timezone: DataTypes.STRING,
      category: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "event",
    }
  );
  return event;
};
