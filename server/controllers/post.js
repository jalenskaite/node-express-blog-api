import {Post} from './../models/post'
import pick from 'lodash.pick'

const get = (req, res) => {
  res.send('get me post')
}

const getAll = (req, res) => {
  res.send('get all posts')
}

const getOne = (req, res) => {
  res.send('get one posts')
}

const create = (req, res) => {
  const body = pick(req.body, ['text', 'title'])

  const todo = new Post({
    _creator: req.user._id,
    ...body
  })

  todo.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e)
  })
}

const update = (req, res) => {
  res.send('update posts')
}

const remove = (req, res) => {
  res.send('delete posts')
}

export {getAll, get, getOne, create, update, remove}