const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER,  process.env.DB_PASSWORD, {
    host: 'containers-us-west-194.railway.app',
    dialect: 'postgres',
    port: "5704"
})



module.exports = sequelize;