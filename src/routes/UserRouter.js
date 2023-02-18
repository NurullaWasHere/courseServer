const {Router} = require('express')
const {loginUser} = require('../controllers/UserController')
const {getCoursesById} = require('../controllers/CourseController')
const authMiddleware = require('../middlewares/authMiddleware')
const courseRouter = require('../routes/CourseRouter');

const router = new Router();

router.use('/courses', courseRouter);

router.post('/login', loginUser)
// router.get('/courses',authMiddleware ,getCoursesById);



module.exports = router;