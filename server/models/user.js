const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: `{VALUE} is not a valid email`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      require: true
    },
    token: {
      type: String,
      require: true
    }
  }]
})

UserSchema.methods.generateAuthToken = function () {
  const user = this
  const access = 'auth'
  const token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString()
  user.tokens = user.tokens.concat([{access, token}])

  return user.save().then(() => {
    return token
  })
}

const User = mongoose.model('User', UserSchema)

export {User}
