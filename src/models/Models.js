const { DataTypes, ARRAY} = require('sequelize')
const sequelize = require('../utils/db');

const CourseModel = sequelize.define('CourseModel', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull:false
    }
})

const UserModel = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    devices: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull:true,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
})

const VideoModel = sequelize.define('VideoModel', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
    link: {
        type:DataTypes.STRING,
        allowNull:true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    size:{
        type: DataTypes.INTEGER,
        allowNull:true
    }
})

const UserCourse = sequelize.define('UserCourse', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true
    }
})




UserModel.belongsToMany(CourseModel, {through: UserCourse});
CourseModel.belongsToMany(UserModel, {through: UserCourse});

CourseModel.hasMany(VideoModel);
VideoModel.belongsTo(CourseModel);

module.exports = {
    UserModel, CourseModel, VideoModel, UserCourse
}