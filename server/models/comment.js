import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  title: {
    type: String,
    required: true,
    minLength: 1,
    maxlength: 100,
    trim: true
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  }
})

const Comment = mongoose.model('Comment', CommentSchema)

export {Comment}
