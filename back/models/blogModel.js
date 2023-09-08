const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A blog must have a title!'],
  },
  content: {
    type: String,
    required: [true, 'A blog must have a content!'],
  },
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A blog must belong to a user!']
  },
  cover: {
    type: String,
  },
  // 摘要
  summary: {
    type: String,
  },
  // 浏览量
  views: {
    type: Number,
    default: 0
  },
  // 点赞量
  likes: {
    type: Number,
    default: 0
  },
  // 收藏量
  collections: {
    type: Number,
    default: 0
  },
  // 标签
  tag: {
    type: String,
  },
  // 发布时间
  timeStamp: {
    type: Number,
    default: Date.now(),
  },
  // 是否为草稿
  isDraft: {
    type: Boolean,
  },
}, {
  // 虚拟字段
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

blogSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'blogID',
  localField: '_id',
})

blogSchema.virtual('reviewCounts', {
  ref: 'Review',
  foreignField: 'blogID',
  localField: '_id',
  count: true
})


blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userID',
    select: 'name'
  })
  next()
})


module.exports = mongoose.model('Blog', blogSchema)