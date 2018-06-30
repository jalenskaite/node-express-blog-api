import {User} from './../models/user'

const authenticate = (req, res, next) => {
  const token = req.header('x-auth')
  User.findByToken(token).then((user) => {
    req.user = user
    next()
  }).catch((e) => {
    req.user = null
    next()
  })
}

export default authenticate
