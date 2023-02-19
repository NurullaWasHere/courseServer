const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER,  process.env.DB_PASSWORD, {
    host: 'containers-us-west-166.railway.app',
    dialect: 'postgres',
    port: 5592,
    define: {
        charset: 'utf-8',
        collate: 'utf8_general_ci'
    }
})



module.exports = sequelize;