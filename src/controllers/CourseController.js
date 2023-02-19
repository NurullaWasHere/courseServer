const { VideoModel, CourseModel, UserModel } = require("../models/Models");

const createCourse = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.json({
        message: "Укажите имя вашего курса",
      });
    }
    const isExist = await CourseModel.findOne({
      where: {
        name,
      },
    });
    if (isExist) {
      return res.json({
        message: "Course already exist!",
      });
    }
    const newCourse = await CourseModel.create({ name });
    res.json({
      message: "Course succesfully created!",
      newCourse,
    });
  } catch (error) {
    res.json({
      message: "Ошибка при созданий курса",
      error,
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await CourseModel.findAll();
    res.json({
      courses,
    });
  } catch (error) {
    console.log(error);
  }
};

const getCoursesById = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await UserModel.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      return res.json({
        message: "User not found",
        code: 401,
      });
    }
    const userCourses = await user.getCourseModels();
    return res.json({
      userCourses,
    });
  } catch (error) {
    console.log(error);
  }
};

const getUsersByCourse = async (req,res) => {
  try {
    const id = req.params.id;
    if(!id){
      return res.json({
        message:"id is undefined"
      })
    }
    const course = await CourseModel.findOne({
      where:{
        id
      }
    })
    if(!course){
      return res.json({
        message:"NOT FOUND"
      })
    }

    const users = await course.getUsers();
    return res.json({
      users
    });
  } catch (error) {
    console.log(error);
  }
}

const deleteCourse = async (req,res) => {
  try {
    const {courseId} = req.body;
    if(!courseId){
      return res.json({
        message:"Нечего удалять"
      })
    }

    const course = await CourseModel.findOne({
      where: {
        id: courseId
      }
    })
    if(!course){
      return res.json({
        message:"Not found"
      })
    }

    await course.destroy();
    res.json({
      message:"Succesfully deleted"
    })
  } catch (error) {
    console.log(error)
  }
}


const deleteVideoFromCourse = async (req, res) => {
  try {
    const { videoId, courseId } = req.body;
    if (!videoId || !courseId) {
      return res.json({
        message: "Курс или видео не указан",
      });
    }

    const video = await VideoModel.findOne({
      where: {
        id: videoId,
      },
    });
    const course = await CourseModel.findOne({
      where: {
        id: courseId,
      },
    });
    if (!video) {
      return res.json({
        message: "Видео не найден",
      });
    }
    if (!course) {
      return res.json({
        message: "Курс не найден",
      });
    }

    await course.removeVideoModel(video);
    res.json({
      message:"Deleted!"
    })
  } catch (err) {
    console.log(err);
  }
};

const addVideoToCourse = async (req, res) => {
  try {
    const { courseId, videoId } = req.body;
    if (!courseId || !videoId) {
      return res.json({
        message: "Неверно указан курс или видео",
      });
    }
    const courseModel = await CourseModel.findOne({
      where: {
        id: courseId,
      },
    });
    if (!courseModel) {
      return res.json({
        message: "Курс не найден",
      });
    }

    const videoModel = await VideoModel.findOne({
      where: {
        id: videoId,
      },
    });

    if (!videoModel) {
      return res.json({
        message: "Video not found",
      });
    }

    await courseModel.addVideoModel(videoModel);
    return res.json({
      message: "Succesfully added",
      code: 201,
    });
  } catch (error) {
    res.json({
      message: "Error occured with adding video to this course",
      error,
    });
  }
};

const addUserToCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) {
      return res.json({
        message: "User or course is not provided",
        code: 401,
      });
    }
    const course = await CourseModel.findOne({
      where: {
        id: courseId,
      },
    });
    if (!course) {
      return res.json({
        message: "Course is not found",
      });
    }
    const user = await UserModel.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.json({
        message: "User is not found",
      });
    }
    await course.addUser(user);
    return res.json({
        message:"Succesfully added"
    })
  } catch (error) {
    console.log(error);
  }
};

const deleteUserFromCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) {
      return res.json({
        message: "User or course is not provided",
        code: 401,
      });
    }
    const course = await CourseModel.findOne({
      where: {
        id: courseId,
      },
    });
    if (!course) {
      return res.json({
        message: "Course is not found",
      });
    }
    const user = await UserModel.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.json({
        message: "User is not found",
      });
    }
    await course.removeUser(user);
  } catch (error) {
    console.log(error);
  }
};

const getVideosFromCourse = async (req,res) => {
    try {
        const {id} = req.params;
        if(!id){
            return res.json({
                message:"Укажите курс"
            })
        }
        
        const course = await CourseModel.findOne({
            where: {
                id
            }
        })
        if(!course){
            return res.json({
                message:"Курс не найден"
            })
        }

        const videos = await course.getVideoModels();

        res.json({
            message:"Videos from course",
            videos
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
  createCourse,
  deleteVideoFromCourse,
  addVideoToCourse,
  deleteUserFromCourse,
  addUserToCourse,
  getCoursesById,
  getAllCourses,
  getVideosFromCourse,
  getUsersByCourse,
  deleteCourse
};
