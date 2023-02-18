const {Storage} = require('megajs')
const fs = require('fs')

class MegaCustomStorage extends Storage{
    constructor(options){
        super(options)
    }
    async _handleFile(req,file, cb) {
        console.log('asd')
        const uploadStream = await this.upload({
            name: file.originalname,
            size: file.size
        }, Buffer.from(file.buffer, 'base64')).complete
        .then((resolve) => {
            console.log("File uploaded succesfully")
        }, (error) => {
            console.log(error)
        }
        );
        uploadStream.end = function(str1, utf, callback){
            console.log('finished')
        }
        file.stream.pipe(uploadStream)
        outStream.on('error', cb)
        outStream.on('finish', function () {
          cb(null, {
            path: path,
            size: outStream.bytesWritten
          })})
    }
    async _removeFile(req,file,cb) {
        cb(null);
    }
}

module.exports = MegaCustomStorage