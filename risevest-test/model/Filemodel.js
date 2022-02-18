const Sequelize = require('sequelize');
const db = require('../configs/config');
const user = require('./Usermodel');
const { nanoid } = require('nanoid');


const File = db.define('File', {
    id:{
        type: Sequelize.STRING,
        autoIncrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    userid: {
        type: Sequelize.STRING,
        references:{ 
            model: 'Users',
            key: 'id',
        }
    },
    filename: {
        type: Sequelize.STRING
    },
    fileurl: {
        type: Sequelize.STRING
    },
    file_dir: {
        type: Sequelize.STRING,
    }
});

user.hasMany(File, {foreignKey: 'userid'});

module.exports = File;