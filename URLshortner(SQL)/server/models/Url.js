const Sequelize = require('sequelize');
const db = require('../config/config');

const Url = db.define('Url', {
    urlCode:{
        type: Sequelize.STRING
    },
    longUrl:{
        type: Sequelize.STRING
    },
    shortUrl:{
        type: Sequelize.STRING
    }
   /* date:{
        type: Sequelize.DATE
    }*/
})

module.exports = Url;