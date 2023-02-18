const {CourseModel, UserModel, UserCourse} = require('../models/Models')


module.exports = async function(req,res ,next){
    if(req.method === "OPTIONS"){
        next();
    }
    try {
        const {id} = req.params;
        if(!id){
            return res.json({
                message:"No course selected"
            })
        }
        const course = await CourseModel.findOne({
            where: {
                id: id
            }
        })
        if(!course){
            return res.json({
                message:"Курс не найден"
            })
        }
        const user = await UserModel.findOne({
            where:{
                id: req.user.id
            }
        })
        if(!user){
            return res.json({
                message:"No such user in database"
            })
        }

        const isAllowed = await course.hasUser(user);
        if(!isAllowed){
            return res.json({
                message:"No acces",
                code:401
            })
        }
        next();
    } catch (err) {
        res.status(401).json({
            message:"Error",
            err
        })
    }
}