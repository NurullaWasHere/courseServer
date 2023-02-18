const { VideoModel, CourseModel } = require("../models/Models");
const fs = require("fs");
const {Storage} = require('@google-cloud/storage')
const {Readable} = require('stream');
const jwt = require('jsonwebtoken')
require('dotenv').config()

const storage = new Storage({keyFilename: "./static/key.json"});

const uploadFile = async (req,res) => {
    try {
        if(!req.file){
            return res.json({
                message: "There is no video to upload",
                code:401
            })
        }
        const isExist = await VideoModel.findOne({where: {name: req.file.originalname}});
        if(isExist){
            return res.json({
                message:"File already exist",
                code: 401
            })
        }
        const myBucket = storage.bucket('coursebuckets');
        const {size, originalname} = req.file;
        const file = myBucket.file(originalname);
        const readableStream = new Readable({
            read(size){
                this.push(req.file.buffer)
                this.push(null);
            }
        })

        const uploadStream = file.createWriteStream();
        readableStream.pipe(uploadStream);
        uploadStream.on('finish',async () => {
            const video = await VideoModel.create({
                link: 'no',
                name: originalname, 
                size
            })
        })
        uploadStream.on('error', (error) => {
            console.log("storage послал тебя нахуй", error)
        })
        res.json({
            message:"Succesfully uploaded",
            code:200
        })
    } catch (error) {
        console.log(error, 'asd')
    }
}


const getAllVideos = async (req, res) => {
    try {
      const courses = await VideoModel.findAll();
      res.json({
        courses,
      });
    } catch (error) {
      console.log(error);
    }
  };

const getVideo = async (req,res) => {
    try {
        const {name} = req.params;
        console.log(req.headers)
        let range = req.headers.range
        if(!range) range = 'bytes=0-'
        const myBucket = storage.bucket('coursebuckets');
        const file = myBucket.file(name);
        if(!file){
            return res.json({
                message:"File not found",
                code:401
            })
        }
        const [metadata] = await file.getMetadata();
        const videoSize = metadata.size;
        // const videoSize = fs.statSync('123.mp4').size
        const chunkSize = 1 * 1e+6;
        const start = Number(range.replace(/\D/g, ''));
        const end = Math.min(start+ chunkSize, videoSize - 1);
        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start} - ${end} / ${videoSize}`,
            "Accept-Ranges": 'bytes',
            "Content-Length" : contentLength,
            "Content-Type" : 'video/mp4'
        }
        res.writeHead(206,headers)
        const readStream = file.createReadStream({start, end});
        readStream.pipe(res);
    } catch (error) {
        console.log(error)
    }
}

const deleteVideo = async (req,res) => {
    try {
        const {name} = req.body;
        if(!name){
            return res.json({
                message:"Укажите имя",
                code:401
            })
        }
        const video = await VideoModel.findOne({where: {name}});
        if(!video){
            return res.json({
                message:"Video doesn't exist",
                code:402
            })
        }
        const myBucket = storage.bucket('coursebuckets');
        const file = myBucket.file(name);
        await file.delete();
        await video.destroy();
        res.json({
            message:"Video succesfully deleted"
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    uploadFile,
    getVideo,
    deleteVideo,
    getAllVideos
}
