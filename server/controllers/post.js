import pick from 'lodash.pick'
import {ObjectID} from 'mongodb'
import {Post} from './../models/post'
import findList from './../helpers/findList'

const get = (req, res) => {
  res.send('get me post')
}

const getAll = (req, res) => {
  const params = pick(req.query, ['start', 'limit'])

  findList(params, {}, Post)
    .then((posts) => res.send(posts))
    .catch((err) => res.status(404).send([]))
}

const getOne = (req, res) => {
  const id = req.params.id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }
  Post.findOne({
    _id: id
  }).then((post) => {
    if (!post) {
      return res.status(404).send()
    }
    return res.status(200).send({post})
  }).catch((e) => res.status(400).send())
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
  const id = req.params.id
  const body = pick(req.body, ['text', 'title'])

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Post.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {
    $set: body
  }, {new: true}).then((post) => {
    if (!post) {
      return res.status(404).send()
    }

    res.status(200).send({post})
  }).catch((e) => {
    res.status(400).send()
  })
}

const remove = (req, res) => {
  const id = req.params.id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }
  Post.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((post) => {
    if (!post) {
      return res.status(404).send()
    }
    return res.status(200).send({post})
  }).catch((e) => res.status(400).send())
}

export {getAll, get, getOne, create, update, remove}
