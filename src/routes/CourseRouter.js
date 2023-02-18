const {Router} = require('express')
const authMiddleware = require('../middlewares/authMiddleware');
const hasAcces = require('../middlewares/hasAcces')
const {getVideosFromCourse, getCoursesById, getUsersByCourse} = require('../controllers/CourseController');
const { getVideo } = require('../controllers/StorageController');

const router = new Router();

router.get('/:id', authMiddleware,hasAcces  ,getVideosFromCourse);
router.get('/', authMiddleware,getCoursesById);
router.get('/video/:name' ,getVideo);

module.exports = router;