import pick from 'lodash.pick'
import {ObjectID} from 'mongodb'
import {Category} from './../models/category'
import findList from './../helpers/findList'

const get = (req, res) => {
  const params = pick(req.query, ['start', 'limit'])
  findList(params, {}, Category)
    .then((categories) => res.send({categories}))
    .catch((err) => res.status(404).send([]))
}

const create = (req, res) => {
  const body = pick(req.body, ['name'])
  const role = req.user.role

  if (role !== 'admin') {
    return res.status(401).send()
  }

  const category = new Category({
    _creator: req.user._id,
    ...body
  })

  category.save().then((category) => {
    res.send({category})
  }, (e) => {
    res.status(400).send(e)
  })
}

const update = (req, res) => {
  const id = req.params.id
  const body = pick(req.body, ['name'])
  const role = req.user.role

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  if (role !== 'admin') {
    return res.status(401).send()
  }

  Category.findByIdAndUpdate(id, {
    $set: body
  }, {new: true}).then((category) => {
    if (!category) {
      return res.status(404).send()
    }

    res.status(200).send({category})
  }).catch((e) => {
    res.status(400).send()
  })
}

const remove = (req, res) => {
  const id = req.params.id
  const role = req.user.role

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  if (role !== 'admin') {
    return res.status(401).send()
  }

  Category.findByIdAndRemove(id).then((category) => {
    if (!category) {
      return res.status(404).send()
    }
    return res.status(200).send({category})
  }).catch((e) => res.status(400).send())
}

export {get, create, update, remove}
