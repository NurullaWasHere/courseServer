const {UserModel,CourseModel} = require('../models/Models');
const jwt = require('jsonwebtoken')
require('dotenv').config()

const createUser = async (req,res) => {
    try {
        const params = req.body;
        const isExist = await UserModel.findOne({where: {name: req.body.name}})
        if(isExist){
            return res.json({
                message: "Пользватель уже существует"
            })
        }
        const user = await UserModel.create(params);
        res.json({
            message: "Пользватель успешно создан!",
            user,
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: "Ошибка при созданий пользвателя", 
            error
        })
    }   
}



const loginUser = async (req,res) => {
    try {
        const params = req.body;
        const user = await UserModel.findOne({
            where: {name: params.name}
        })
        if(!user){
            return res.json({message: "Пользватель не найден!"})
        }
        if(params.password !== user.password){
            return res.json({message: "Неверный пароль"})
        }
        const deviceArr = [];
        if(user.devices && !user.devices.includes(req.body.ip) && !user.isAdmin){
            deviceArr.push(req.body.ip)
            for (let i = 0; i < user.devices.length; i++) {
                deviceArr.push(user.devices[i]);
            }
            await UserModel.update({
                devices: deviceArr
            },
            {where: {name: params.name}, returning:true, plain:true} ).then((async (result) => {
                // console.log(result[1].devices)
                if(result[1].devices.length > 2){
                    await UserModel.destroy({
                        where: {
                            id: user.id
                        }
                    })
                    return res.json({
                        message: "Account deleted"
                    })
                }
            }))
        }

        if(!user.devices){
            deviceArr.push(req.body.ip);
            await UserModel.update({
                devices:deviceArr
            },
            {where: {name: params.name, password: params.password}, returning: true, plain:true})
       }

        const token = jwt.sign({
            id: user.id,
            isAdmin: user.isAdmin,
            name:user.name
        },
        process.env.SECRET_KEY,
        {expiresIn: '24h'});
        return res.json({
            token
        });
    } catch (error) {
        console.log('Ошибка с логином', error);
    }
}


const deleteUser = async (req,res) => {
    try {
        const { id } = req.body;
        if(!id){
            return res.json({
                message:"Нужно указать name или id"
            })
            }
        await UserModel.destroy({
            where: {
                id
            }
        })
    } catch (error) {
        res.json({
            message: "Ошибка при удалений пользвателя",
            error
        })
    }
}

const getAllUsers = async (req,res) => {
    try {
        const users = await UserModel.findAll();
        if(!users){
            return res.json({
                message: "В базе данных не пользвателей"
            })
        }
        res.send(users)
    } catch (error) {
        res.json({
            message:"Ошибка при getAllUsers",
            error
        })
    }
}

module.exports = {
    loginUser, 
    createUser,
    deleteUser,
    getAllUsers
}