import {User} from './../models/user'

const authenticate = (req, res, next) => {
  const token = req.header('x-auth')
  User.findByToken(token).then((user) => {
    if (!user) {
      res.status(404).send()
    }

    req.user = user
    req.token = token
    next()
  }).catch((e) => {
    res.status(401).send()
  })
}

export default authenticate
