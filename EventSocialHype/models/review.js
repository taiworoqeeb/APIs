'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.Event, {
        foreignKey: "eventId",
        as: "event",
      });
      Review.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  };
  Review.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
    },
    userId: {
      allowNull: true,
      type: DataTypes.UUID,
      unique: true
    },
    eventId: {
      allowNull: true,
      type: DataTypes.UUID
    },
    star: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: 5,
        min: 1
      }
    },
  }, {
    sequelize,
    modelName: 'Review',
    tableName:"reviews",
    timestamps: true,
    paranoid:true
  });
  // Review.sync({force: true})
  return Review;
};