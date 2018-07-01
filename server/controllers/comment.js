import pick from 'lodash.pick'
import {ObjectID} from 'mongodb'
import {Comment} from './../models/comment'
import findList from './../helpers/findList'

const get = (req, res) => {
  const params = pick(req.query, ['start', 'limit', 'postId'])

  if (!req.query.postId) {
    return res.status(404).send({comments: []})
  }

  const id = req.query.id ? {parentId: req.query.id} : {parentId: null}

  const query = {
    ...params,
    ...id
  }

  findList(params, query, Comment)
    .then((comments) => res.send({comments}))
    .catch((err) => res.status(404).send({comments: []}))
}

const getMe = (req, res) => {
  const params = pick(req.query, ['start', 'limit'])

  const query = {
    _creator: req.user._id
  }

  findList(params, query, Comment)
    .then((comments) => res.send({comments}))
    .catch((err) => res.status(404).send({comments: []}))
}

const getAll = (req, res) => {
  const params = pick(req.query, ['start', 'limit'])
  const role = req.user.role

  if (role !== 'admin') {
    return res.status(401).send()
  }

  findList(params, {}, Comment)
    .then((comments) => res.send({comments}))
    .catch((err) => res.status(404).send([]))
}

const create = (req, res) => {
  const body = pick(req.body, ['title', 'text', 'postId', 'parentId'])

  if (!req.body.title || !req.body.text || !req.body.postId) {
    return res.status(400).send()
  }

  const creator = req.user ? {
    _creator: req.user._id
  } : {}

  const comment = new Comment({
    ...body,
    ...creator
  })

  comment.save().then((comment) => {
    res.send({comment})
  }, (e) => {
    res.status(400).send(e)
  })
}

const remove = (req, res) => {
  const id = req.params.id
  const admin = req.user.role === 'admin'

  if (!ObjectID.isValid(id)) {
    return res.status(401).send()
  }

  const query = admin ? {
    _id: id
  } : {
    _id: id,
    _creator: req.user._id
  }

  Comment.findOneAndRemove(query).then((comment) => {
    if (!comment) {
      return res.status(400).send()
    }
    return res.status(200).send({comment})
  }).catch((e) => res.status(400).send())
}

export {get, create, remove, getMe, getAll}
