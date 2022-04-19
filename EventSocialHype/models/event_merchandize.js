'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventMerchandise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      EventMerchandise.belongsTo(models.Event, {
        foreignKey: "eventId",
        as: "tickets",
      });
      EventMerchandise.hasMany(models.MerchandiseSale, {
        foreignKey: "eventMerchandiseId",
        as: "sales",
      });
      
    }
    
    
  };
  EventMerchandise.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    eventId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    title: {
      allowNull: true,
      type: DataTypes.STRING
    },
    amount: {
      allowNull: true,
      type: DataTypes.FLOAT
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'EventMerchandise',
    timestamps: true,
    paranoid: true,
    tableName: 'event_merchandise',
  });
  // EventMerchandise.sync({force: true})
  return EventMerchandise;
};