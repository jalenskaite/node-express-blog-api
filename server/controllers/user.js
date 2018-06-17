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

const login = (rq, res) => {
  res.send('login user')
}

const logout = (rq, res) => {
  res.send('logout user')
}

export {get, create, login, logout}
