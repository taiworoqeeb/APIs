'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // Package.hasMany(models.Event, {
      //   foreignKey: "package_id",
      //   as: "investment"
      // });
    }
    
    
  };
  Package.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    name: {
      allowNull: true,
      type: DataTypes.STRING
    },
    price: {
      allowNull: true,
      type: DataTypes.FLOAT,
    },
    duration: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    description: {
      allowNull: true,
      type: DataTypes.TEXT
    },
  }, {
    sequelize,
    modelName: 'Package',
    timestamps: true,
    paranoid: true,
    tableName: 'plans',
  });
  return Package;
};