'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BankDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      BankDetail.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      
    }
    
    
  };
  BankDetail.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    bank_name: {
      allowNull: true,
      type: DataTypes.STRING
    },
    account_number: {
      allowNull: true,
      type: DataTypes.STRING,
      unique: true
    },
    account_name: {
      allowNull: true,
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'BankDetail',
    timestamps: true,
    paranoid: true,
    tableName: 'bank_details',
  });
  // BankDetail.sync({force: true});
  return BankDetail;
};