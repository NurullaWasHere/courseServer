const mega = require('megajs')
const multer = require('multer')
require('dotenv').config()

class MegaStorageEngine{
    constructor(options){
        this.optoins = options
    }
    _handleFile(req, file, cb){
        const mg = new mega.Storage({
            email:process.env.MEGA_EMAIL,
            password: process.env.MEGA_PASSWORD
        })
        mg.createFolder('uploads', (err) => {
            if(err) return cb(err);
        })
    }
}

module.exports = MegaStorageEngine