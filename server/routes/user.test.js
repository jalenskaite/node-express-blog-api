import expect from 'expect'
import request from 'supertest'

import app from './../server'
import {User} from './../models/user'
import {users, populateUsers} from './../seed/test/user'

const prefix = '/api'

beforeEach(populateUsers)

describe(`POST ${prefix}/users`, () => {
  it('should create users', (done) => {
    const email = 'email@example.com'
    const password = 'abs123'

    request(app)
      .post(`${prefix}/users`)
      .send({
        email,
        password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy()
        expect(res.body._id).toBeTruthy()
        expect(res.body.email).toBe(email)
      })
      .end((err) => {
        if (err) {
          return done(err)
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy()
          expect(user.password).not.toBe(password)
          done()
        }).catch((e) => done())
      })
  })

  it('should return validation errors', (done) => {
    const email = 'emailexample.com'
    const password = 'abs12'

    request(app)
      .post(`${prefix}/users`)
      .send({
        email,
        password
      })
      .expect(400)
      .end(done)
  })

  it('should not create user if email in use', (done) => {
    const password = 'abs12'
    request(app)
      .post(`${prefix}/users`)
      .send({
        email: users[0].email,
        password
      })
      .expect(400)
      .end(done)
  })
})
