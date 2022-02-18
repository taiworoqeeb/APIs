const Sequelize = require('sequelize');
const db = require('../configs/config');
const {nanoid} = require('nanoid');


const User = db.define('User', {
        id: {
            type: Sequelize.STRING(10),
            autoincrement: false,
            allowNull: false,
            primaryKey: true,
            defaultValue: () => nanoid(10)
        },
        fullname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            min: 3,
            max: 20
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            min: 6,
            max: 20
        },
        role: {
            type: Sequelize.ENUM,
            values: ['user', 'admin'],
            default: 'user'
        }
});
module.exports = User;
