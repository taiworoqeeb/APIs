'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MerchandiseSale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MerchandiseSale.belongsTo(models.EventMerchandise, {
        foreignKey: "eventMerchandiseId",
        as: "merchandise",
      });
      
      MerchandiseSale.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      
      
    }
    
    
  };
  MerchandiseSale.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    eventMerchandiseId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    
  }, {
    sequelize,
    modelName: 'MerchandiseSale',
    timestamps: true,
    paranoid: true,
    tableName: 'merchandise_sales',
  });
  // MerchandiseSale.sync({force: true})
  return MerchandiseSale;
};