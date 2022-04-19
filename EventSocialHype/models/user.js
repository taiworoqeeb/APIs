'use strict';
const {
  Model
} = require('sequelize');
const dayjs = require("dayjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }
  };
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    name: {
      allowNull: true,
      type: DataTypes.STRING
    },
    username: {
      allowNull: true,
      type: DataTypes.STRING
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING
    },
    phone: {
      allowNull: true,
      type: DataTypes.STRING
    },
    activated:{
      allowNull: true,
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    token: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM("event_organizer", "event_vendor", "socialite"),
      allowNull: true,
    },
    wallet: {
      allowNull: true,
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    business: {
      allowNull: true,
      type: DataTypes.STRING
    },
    address: {
      allowNull: true,
      type: DataTypes.STRING
    },
    state: {
      allowNull: true,
      type: DataTypes.STRING
    },
    city: {
      allowNull: true,
      type: DataTypes.STRING
    },
    country: {
      allowNull: true,
      type: DataTypes.STRING
    },
    referral_count: {
      allowNull: true,
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    referral_amount: {
      allowNull: true,
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    password: {
      allowNull: true,
      type: DataTypes.STRING
    },
    reference: {
      allowNull: true,
      type: DataTypes.STRING
    },
    referral_id: {
      allowNull: true,
      type: DataTypes.UUID,
    },
    image: {
      allowNull: true,
      type: DataTypes.STRING
    },
    facebook: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    snapchat: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    instagram: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    twitter: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    eHypeCurrency: {
      allowNull: true,
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    paranoid: true,
    tableName: 'users',
  });
  // User.sync({force: true})
  return User;
};