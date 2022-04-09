//const { Model, DataTypes} = require('sequelize');
//const db = require('../database/db');
/*const Event = require('./events');
const User = require('./adminuser')

const EventJob = db.define('eventjob', {
    id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    eventId:{
        type: DataTypes.INTEGER,
        references:{ 
            model: 'event',
            key: 'id',
        }
    },
    job_type: {
        type: DataTypes.STRING,
    },
    job_description: {
        type: DataTypes.STRING,
    },
    budget: {
        type: DataTypes.STRING
    },
    country:{
        type: DataTypes.STRING
    },
    assign: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    userassign: {
        type: DataTypes.STRING,
        references:{ 
            model: 'adminuser',
            key: 'id',
        }
    }
}, {timestamps: true});

EventJob.belongsTo(Model.event, {foreignKey: 'eventId'})
EventJob.belongsTo(User, {foreignKey: 'userassign'})


module.exports = EventJob;*/

const {nanoid} = require('nanoid');
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class eventjob extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      eventjob.belongsTo(models.event);
      //eventjob.belongsTo(models.adminuser);
      //event.hasMany(models.eventjob)
    }
  }
  eventjob.init(
    {
    id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    job_type: {
        type: DataTypes.STRING,
    },
    job_description: {
        type: DataTypes.STRING,
    },
    budget: {
        type: DataTypes.STRING,
        required: true
    },
    location:{
        type: DataTypes.STRING
    },
    assign: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    img_id: {
        type: DataTypes.STRING
      },
    img_url: {
    type: DataTypes.STRING
    },

    },
    {
      sequelize,
      modelName: "eventjob",
      timestamps: true
    }
  );
  return eventjob;
};
