import mongoose from 'mongoose'

const Post = mongoose.model('Post', {
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
  categories: [],
  comments: [],
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

export {Post}
