'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // EventImages.belongsTo(models.Event, {
      //   foreignKey: "eventId",
      //   as: "image",
      // });
      
    }
    
    
  };
  EventImages.init({
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
    modelName: 'EventImages',
    timestamps: true,
    paranoid: true,
    tableName: 'event_images',
  });
  // EventImages.sync({force: true})
  return EventImages;
};