const express = require('express')
const router = express.Router()
const multer = require('multer')
const { signup,login,protect,logout,androidLogin,androidSignup,restrictTo } = require('../controllers/userController')
const { androidHomeFilters,homeFilters, getAllBlogs, getBlog, createBlog, updateBlog, updateLikes } = require('../controllers/blogController')
const { getReviews, createReview, deleteReview } = require('../controllers/reviewController')
const AppError = require('../utils/appError')

// 认证
router.post('/signup', signup)
router.post('/login', login)
router.get('/logout', logout)

// 博客
router.route('/blog')
  .get(homeFilters, getAllBlogs)
  .post(protect, restrictTo('admin'), createBlog)
router.route('/blog/:id')
  .get(getBlog)
  .patch(protect, restrictTo('admin'), updateBlog)
  
router.get('/blog/:id/updatelikes', updateLikes)

// 评论
router.route('/blog/:id/reviews')
  .get(getReviews)
  .post(protect, createReview)

router.route('/blog/:id/reviews/:reviewId')
  .delete(protect, deleteReview)

// 安卓端
router.route('/android/login').post(androidLogin)
router.route('/android/signup').post(androidSignup)
router.route('/android').get(androidHomeFilters, getAllBlogs)
router.route('/android/:id').get(getBlog)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
      // 设置上传路径
      cb(null, 'uploads/')
    } else {
      // 通过自定义的错误类，抛出错误
      cb(new AppError('请上传jpg/png格式的图片文件！', 400))
    }
  },
  // 设置文件命名
  filename: function (req, file, cb) {
    const fileFormat = file.originalname.split('.')
    const filename = Date.now() + '.' + fileFormat[fileFormat.length - 1]
    cb(null, filename)
  }
})

router.post('/uploadCover', protect, multer({ storage }).single('cover'), (req, res) => {
  console.log(req.file)
  res.status(200).json({
    status: 'success',
    data: {
      cover: req.file.filename
    }
  })
})



module.exports = router