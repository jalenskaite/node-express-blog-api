import {ObjectID} from 'mongodb'
import jwt from 'jsonwebtoken'

import {User} from './../../models/user'

const userOneId = new ObjectID()
const userTwoId = new ObjectID()
const userThreeId = new ObjectID()
const userFourId = new ObjectID()
const userFiveId = new ObjectID()

const users = [{
  _id: userOneId,
  email: 'testemail1@gmail.com',
  password: 'password1',
  role: 'admin',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'testemail2@gmail.com',
  password: 'password2',
  role: 'user',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
},
{
  _id: userThreeId,
  email: 'testemail3@gmail.com',
  password: 'password2',
  role: 'user',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userThreeId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
},
{
  _id: userFourId,
  email: 'testemail4@gmail.com',
  password: 'password2',
  role: 'user',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userFourId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
},
{
  _id: userFiveId,
  email: 'testemail5@gmail.com',
  password: 'password2',
  role: 'admin',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userFiveId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}]

const populateUsers = (done) => {
  User.remove({}).then(() => {
    const userOne = new User(users[0]).save()
    const userTwo = new User(users[1]).save()
    const userThree = new User(users[2]).save()
    const userFour = new User(users[3]).save()
    const userFive = new User(users[4]).save()

    return Promise.all([userOne, userTwo, userThree, userFour, userFive])
  }).then(() => done())
}

export {users, populateUsers, userOneId, userTwoId, userThreeId}
