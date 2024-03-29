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

describe(`GET ${prefix}/users/me`, () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get(`${prefix}/users/me`)
      .set('x-auth', users[0].tokens[0].token)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  })

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get(`${prefix}/users/me`)
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)
  })
})

describe(`POST ${prefix}/users/login`, () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post(`${prefix}/users/login`)
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy()
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.toObject().tokens[1]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          })
          done()
        }).catch((e) => done(e))
      })
  })

  it('should reject invalid login', (done) => {
    request(app)
      .post(`${prefix}/users/login`)
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy()
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1)
          done()
        }).catch((e) => done(e))
      })
  })
})

describe(`DELETE ${prefix}/users/logout`, () => {
  it('shoudl remove auth token on logout', (done) => {
    request(app)
      .delete(`${prefix}/users/logout`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0)
          done()
        }).catch((e) => done(e))
      })
  })
})
