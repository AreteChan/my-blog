const Review = require('../models/reviewModel')
const catchAsync = require('../utils/catchAsync')

exports.getReviews = catchAsync(async (req, res, next) => {
  let filter = {}
  if (req.params.id) filter = { blogID: req.params.id }

  const reviews = await Review.find( filter )
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  })
})

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.blog) req.body.blogID = req.params.id
  if (!req.body.user) req.body.userID = req.user._id

  const newReview = await Review.create(req.body)
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  })
})

exports.deleteReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.reviewId
  const review = await Review.findByIdAndDelete(reviewId)
  if (!review) {
    return next(new AppError(`Can't find review with ID ${reviewId}！`, 404))
  }
  res.status(200).json({
    status: 'success',
    message: "Delete success!"
  })
})