//const Sequelize = require('sequelize');
//const db = require('../database/db');
const {nanoid} = require('nanoid');
/*const Eventjob = require('./eventjob');
const User = require('./adminuser')

const Proposal = db.define("proposal", {
    id: {
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    userId:{
        type: Sequelize.STRING,
        references:{ 
            model: 'user',
            key: 'id',
        }
    },
    jobId:{
        type: Sequelize.STRING,
        references:{ 
            model: 'eventjob',
            key: 'id',
        }
    },
    description: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.STRING
    }
}, {timestamps: true});

Proposal.belongsTo(Eventjob, {foreignKey: 'jobId'})
Eventjob.hasMany(Proposal, {foreignKey: 'jobId'})
Proposal.belongsTo(User, {foreignKey: 'userId'})
User.hasMany(Proposal, {foreignKey: 'userId'})

module.exports = Proposal;*/

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class proposal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      proposal.belongsTo(models.eventjob);
      proposal.belongsTo(models.adminuser);
      //event.hasMany(models.eventjob)
    }
  }
  proposal.init(
    {
        id: {
            type: DataTypes.STRING(10),
            autoincrement: false,
            allowNull: false,
            primaryKey: true,
            defaultValue: () => nanoid(10)
        },
        description: {
            type: DataTypes.STRING
        },
        price: {
            type: DataTypes.STRING
        }
    },
    {
      sequelize,
      modelName: "proposal",
    }
  );
  return proposal;
};
