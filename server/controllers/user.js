import {User} from './../models/user'
import pick from 'lodash.pick'

const get = (req, res) => {
  res.send(req.user)
}

const create = (req, res) => {
  const body = pick(req.body, ['email', 'password'])
  const user = new User(body)

  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    res.status(200).header('x-auth', token).send(user)
  }).catch((e) => {
    res.status(400).send()
  })
}

const login = (req, res) => {
  const body = pick(req.body, ['email', 'password'])
  User.findByCredentials(body.email, body.password).then((user) => {
    user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user)
    })
  }).catch((e) => {
    res.status(400).send()
  })
}

const logout = (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send()
  }, () => {
    res.status(400).send()
  })
}

export {get, create, login, logout}
