// import {Post} from './../models/post'

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
  res.send('create posts')
}

const update = (req, res) => {
  res.send('update posts')
}

const remove = (req, res) => {
  res.send('delete posts')
}

export {getAll, get, getOne, create, update, remove}
