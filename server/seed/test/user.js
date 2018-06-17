import {ObjectID} from 'mongodb'
import jwt from 'jsonwebtoken'

import {User} from './../../models/user'

const userOneId = new ObjectID()
const userTwoId = new ObjectID()
const users = [{
  _id: userOneId,
  email: 'testemail1@gmail.com',
  password: 'password1',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'testemail2@gmail.com',
  password: 'password2',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}]

const populateUsers = (done) => {
  User.remove({}).then(() => {
    const userOne = new User(users[0]).save()
    const userTwo = new User(users[1]).save()

    return Promise.all([userOne, userTwo])
  }).then(() => done())
}

export {users, populateUsers}
