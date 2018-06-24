import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxlength: 100,
    trim: true
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

const Category = mongoose.model('Category', CategorySchema)

export {Category}
