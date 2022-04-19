'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventFilter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // EventFilter.belongsTo(models.Event, {
      //   foreignKey: "eventId",
      //   as: "image",
      // });
      
    }
    
    
  };
  EventFilter.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    eventId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    image: {
      allowNull: true,
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'EventFilter',
    timestamps: true,
    paranoid: true,
    tableName: 'event_filters',
  });
  // EventFilter.sync({force: true})
  return EventFilter;
};