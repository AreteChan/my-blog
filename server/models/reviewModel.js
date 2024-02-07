const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
  content: {
    type: String,
    required: [true, 'A review must have a content!'],
  },
  likes: {
    type: Number,
    default: 0
  },
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A review must belong to a user!']
  },
  blogID: {
    type: mongoose.Schema.ObjectId,
    ref: 'Blog',
    required: [true, 'A review must belong to a blog!']
  },
  timeStamp: {
    type: Number,
    default: Date.now(),
  },
  // 评论的评论
  reviewID: {
    type: mongoose.Schema.ObjectId,
    ref: 'Review',
  },
})

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userID',
    select: 'name'
  })
  next()
})

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'reviewID',
    select: 'content'
  })
  next()
})

module.exports = mongoose.model('Review', reviewSchema)
