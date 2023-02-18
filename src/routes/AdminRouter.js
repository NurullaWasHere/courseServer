const {Router} = require('express')

const {createUser, getAllUsers, deleteUser} = require('../controllers/UserController')
const {uploadFile, deleteVideo, getAllVideos} = require('../controllers/StorageController')
const {createCourse,getUsersByCourse,addUserToCourse, addVideoToCourse, deleteVideoFromCourse, getAllCourses, getCoursesById, deleteUserFromCourse, getVideosFromCourse, deleteCourse} = require('../controllers/CourseController');
const isAdminMiddleware = require('../middlewares/isAdmin');
const multer = require('multer')

const MegaStorage = require('../../Storage/megaStorage');
const megaStorage = new MegaStorage({
    email:process.env.MEGA_EMAIL,
    password: process.env.MEGA_PASSWORD
})

const upload = multer({
    megaStorage
})


const router = new Router();

router.get('/courses', isAdminMiddleware, getAllCourses);
router.get('/users', isAdminMiddleware, getAllUsers)
router.get('/videos', isAdminMiddleware, getAllVideos)
router.get('/users/:id', isAdminMiddleware, getUsersByCourse)
router.get('/videos/:id', isAdminMiddleware, getVideosFromCourse)

router.post('/createUser',isAdminMiddleware, createUser);
router.post('/uploadFile', isAdminMiddleware, upload.single('video'), uploadFile);
router.post('/createCourse', isAdminMiddleware, createCourse);

router.delete('/deleteVideo', isAdminMiddleware, deleteVideo);
router.delete('/deleteVideoFromCourse', isAdminMiddleware, deleteVideoFromCourse);
router.delete('/deleteUserFromCourse', isAdminMiddleware, deleteUserFromCourse);
router.delete('/deleteUser', isAdminMiddleware, deleteUser)
router.delete('/deleteCourse', isAdminMiddleware, deleteCourse)

router.put('/addUserToCourse', isAdminMiddleware, addUserToCourse);
router.put('/addVideoToCourse', isAdminMiddleware, addVideoToCourse);


module.exports = router;



