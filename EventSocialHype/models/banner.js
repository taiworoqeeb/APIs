'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Banner.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull:true
    },
    title: {
        allowNull: true,
        type: DataTypes.STRING
    },
    image: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    expiredAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Banner',
    tableName:"banners",
    timestamps: true,
    paranoid:true
  });
  return Banner;
};