const { VideoModel, CourseModel } = require("../models/Models");
const fs = require("fs");
const {Storage} = require('@google-cloud/storage')
const {Readable} = require('stream');
const jwt = require('jsonwebtoken')
const utf = require('utf8')
const ffmpeg = require('ffmpeg')

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
        let {size, originalname} = req.file;
        originalname = utf.decode(originalname);
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
        // console.log(req.headers)
        let range = req.headers.range
        // if(!range) range = 'bytes=0-'
        if(req.headers.referer !== "https://course-client-nine.vercel.app/"){
            return res.json({message: "No acces from another domain"})
        }
        
        const options = {};
        let start;
        let end;

        if (range) {
            const bytesPrefix = "bytes=";
            if (range.startsWith(bytesPrefix)) {
                const bytesRange = range.substring(bytesPrefix.length);
                const parts = bytesRange.split("-");
                if (parts.length === 2) {
                    const rangeStart = parts[0] && parts[0].trim();
                    if (rangeStart && rangeStart.length > 0) {
                        options.start = start = parseInt(rangeStart);
                    }
                    const rangeEnd = parts[1] && parts[1].trim();
                    if (rangeEnd && rangeEnd.length > 0) {
                        options.end = end = parseInt(rangeEnd);
                    }
                }
            }
        }

        if (req.method === "HEAD") {
            res.statusCode = 200;
            res.setHeader("accept-ranges", "bytes");
            res.setHeader("content-length", contentLength);
            res.end();
        }

    
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

        let contentLength = videoSize;

        let retrievedLength;
        if (start !== undefined && end !== undefined) {
            retrievedLength = (end+1) - start;
        }
        else if (start !== undefined) {
            retrievedLength = contentLength - start;
        }
        else if (end !== undefined) {
            retrievedLength = (end+1);
        }
        else {
            retrievedLength = contentLength;
        }
        // const chunkSize = 1 * 1e+6;
        // const start = Number(range.replace(/\D/g, ''));

        // let end = Math.min(start+ chunkSize, videoSize - 1);
        // let contentLength = end - start + 1;

        

        const headers = {
            "Content-Range": `bytes ${start || 0}-${end || (contentLength-1)}/${contentLength}`,
            "Accept-Ranges": 'bytes',
            "Content-Length" : retrievedLength,
            "Content-Type" : 'video/mp4'
        }

        if (range !== undefined) {  
            res.setHeader("Content-Range", `bytes ${start || 0}-${end || (contentLength-1)}/${contentLength}`);
            res.setHeader("Accept-Ranges", "bytes");
        }

        res.writeHead(206,headers)
            const readStream = file.createReadStream(options);
            readStream.pipe(res);
            readStream.on('error', (error) => {
                console.log(error);
            })

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
