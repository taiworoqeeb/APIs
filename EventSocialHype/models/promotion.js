'use strict';
const {
  Model
} = require('sequelize');
const dayjs = require("dayjs");

module.exports = (sequelize, DataTypes) => {
  class Promotion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Promotion.belongsTo(models.Package, {
        foreignKey: "packageId",
        as: "plan",
      });
      Promotion.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      Promotion.belongsTo(models.Event, {
        foreignKey: "eventId",
        as: "event",
      });
    }

  }
  
  Promotion.init({
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
    packageId: {
      allowNull: true,
      type: DataTypes.UUID,
    },
    eventId: {
      allowNull: true,
      type: DataTypes.UUID,
    },
    promotion_type: {
      type: DataTypes.ENUM("social_media", "local_press", "both")
    },
    status: {
      allowNull: true,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    expiredAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    name: {
      allowNull: true,
      type: DataTypes.STRING
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING
    },
    mobile: {
      allowNull: true,
      type: DataTypes.STRING
    },
    newspaper: {
      type:DataTypes.BOOLEAN,
      defaultValue: false
    },
    radio: {
      type:DataTypes.BOOLEAN,
      defaultValue: false
    },
    television: {
      type:DataTypes.BOOLEAN,
      defaultValue: false
    },
    
  }, {
    sequelize,
    modelName: 'Promotion',
    timestamps: true,
    paranoid: true,
    tableName: 'promotions',
  });
  // Promotion.sync()
  return Promotion;
};