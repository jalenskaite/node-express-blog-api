import {User} from './../models/user'

const user = (req, res, next) => {
  const token = req.header('x-auth')
  User.findByToken(token).then((user) => {
    req.user = !user ? null : user
    next()
  }).catch((e) => {
    res.status(401).send()
  })
}

export default user
