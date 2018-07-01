import pick from 'lodash.pick'
import {ObjectId} from 'mongodb'
import {Post} from './../models/post'
import findListAndAggregate from './../helpers/findListAndAggregate'

const get = (req, res) => {
  const params = pick(req.query, ['start', 'limit'])
  const stages = [
    {$match: {_creator: req.user._id.toString()}},
    {$lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'postId',
      as: 'commentsCount'
    }},
    {$addFields: {
      'commentsCount': {
        $size: '$commentsCount'
      }
    }},
    {$lookup: {
      from: 'users',
      localField: '_creator',
      foreignField: '_id',
      as: 'author'
    }},
    {$addFields: {
      'author': '$author.email'
    }},
    {$project: {
      _id: 0,
      commentsCount: 1,
      categories: 1,
      title: 1,
      text: 1,
      author: { $arrayElemAt: [ '$author', 0 ] }
    }}
  ]

  findListAndAggregate(params, stages, Post)
    .then((posts) => res.send({posts}))
    .catch((err) => res.status(404).send([]))
}

const getAll = (req, res) => {
  const params = pick(req.query, ['start', 'limit'])

  const stages = [
    {$lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'postId',
      as: 'commentsCount'
    }},
    {$addFields: {
      'commentsCount': {
        $size: '$commentsCount'
      }
    }},
    {$lookup: {
      from: 'users',
      localField: '_creator',
      foreignField: '_id',
      as: 'author'
    }},
    {$addFields: {
      'author': '$author.email'
    }},
    {$project: {
      _id: 0,
      commentsCount: 1,
      categories: 1,
      title: 1,
      text: 1,
      author: { $arrayElemAt: [ '$author', 0 ] }
    }}
  ]

  findListAndAggregate(params, stages, Post)
    .then((posts) => res.send({posts}))
    .catch((err) => res.status(404).send([]))
}

const getOne = (req, res) => {
  const id = req.params.id
  if (!ObjectId.isValid(id)) {
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

  if (!ObjectId.isValid(id)) {
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
  if (!ObjectId.isValid(id)) {
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
