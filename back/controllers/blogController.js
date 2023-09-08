const Blog = require('../models/blogModel')
const catchAsync = require('../utils/catchAsync')
const ApiFeatures = require('../utils/ApiFeatures')
const AppError = require('../utils/appError')

exports.androidHomeFilters = (req, res, next) => {
  req.query.fields = 'title,summary,cover,timeStamp'
  next()
}

exports.homeFilters = (req, res, next) => {
  req.query.fields = 'title,summary,cover,timeStamp,tag,views,likes,comments'
  next()
}

exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Blog.find(), req.query).filter().sort().limitFields().paginate().titleSearch()
  const blogs = await features.query.populate('reviewCounts')
  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: {
      blogs
    }
  })
})

exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id).populate('reviews')
  if (!blog) return next(new AppError('No blog found with that ID', 404))

  // 浏览量+1
  blog.views++
  await blog.save()

  res.status(200).json({
    status: 'success',
    data: {
      blog
    }
  })
})

exports.createBlog = catchAsync(async (req, res, next) => {
  req.body.userID = req.user._id

  const newBlog = await Blog.create(req.body)
  res.status(201).json({
    status: 'success',
    data: {
      blog: newBlog
    }
  })
})

exports.updateBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // 返回更新后的文档
    runValidators: true // 运行更新后的文档的验证
  })

  if (!blog) return next(new AppError('No blog found with that ID', 404))

  res.status(200).json({
    status: 'success',
    data: {
      blog
    }
  })
})

// 更新点赞量
exports.updateLikes = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id)
  if (!blog) return next(new AppError('No blog found with that ID', 404))

  blog.likes++
  await blog.save()

  res.status(200).json({
    status: 'success',
    data: {
      blog
    }
  })
})



