import expect from 'expect'
import request from 'supertest'

import app from './../server'
import {Category} from './../models/category'
import {users, populateUsers} from './../seed/test/user'
import {categories, populateCategories} from './../seed/test/category'

const prefix = '/api'

beforeEach(populateUsers)
beforeEach(populateCategories)

describe(`GET ${prefix}/cateogires`, () => {
  it('should get all categories', (done) => {
    request(app)
      .get(`${prefix}/categories`)
      .expect(200)
      .end((err) => {
        if (err) {
          return done(err)
        }

        Category.find().then((categories) => {
          expect(categories.length).toBeLessThan(11)
          done()
        }).catch((e) => done(e))
      })
  })

  it('should skip and get limitted list with params ', (done) => {
    request(app)
      .get(`${prefix}/categories`)
      .query({limit: 1, start: 1})
      .expect(200)
      .expect((res) => {
        expect(res.body.categories.length).toBe(1)
        expect(res.body.categories[0].name).toBe(categories[1].name)
      })
      .end(done)
  })

  it('should default params overide invalid params ', (done) => {
    request(app)
      .get(`${prefix}/categories`)
      .query({limit: 'fsd', start: 'fff'})
      .expect(200)
      .expect((res) => {
        expect(res.body.categories.length).toBeGreaterThan(1)
        expect(res.body.categories[0].name).toBe(categories[0].name)
      })
      .end(done)
  })
})

describe(`POST ${prefix}/cateogires`, () => {
  it('should create new category', (done) => {
    const name = 'Category name'
    request(app)
      .post(`${prefix}/categories`)
      .set('x-auth', users[0].tokens[0].token)
      .send({ name })
      .expect(200)
      .expect((res) => {
        expect(res.body.category.name).toBe(name)
      })
      .end(done)
  })

  it('should not create category with invalid body data', (done) => {
    request(app)
      .post(`${prefix}/categories`)
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err)
        }

        Category.find().then((dbCategories) => {
          expect(dbCategories.length).toBe(categories.length)
          done()
        }).catch((e) => done(e))
      })
  })

  it('should not create category if user role is not admin', (done) => {
    const name = 'Category name'
    request(app)
      .post(`${prefix}/categories`)
      .set('x-auth', users[1].tokens[0].token)
      .send({name})
      .expect(401)
      .end((err) => {
        if (err) {
          return done(err)
        }

        Category.find().then((dbCategories) => {
          expect(dbCategories.length).toBe(categories.length)
          done()
        }).catch((e) => done(e))
      })
  })
})

describe(`PATCH ${prefix}/cateogires/:id`, () => {
  it('should update category', (done) => {
    const hexId = categories[0]._id.toHexString()
    const name = 'Category name update'
    request(app)
      .patch(`${prefix}/categories/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({name})
      .expect(200)
      .expect((res) => {
        expect(res.body.category.name).toBe(name)
      })
      .end(done)
  })

  it('should not update the category if user role is not admin', (done) => {
    const hexId = categories[1]._id.toHexString()
    const name = 'Category name update'
    request(app)
      .patch(`${prefix}/categories/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({name})
      .expect(401)
      .end(done)
  })
})

describe(`DELETE ${prefix}/categories/:id`, () => {
  it('should remove the category', (done) => {
    const hexId = categories[0]._id.toHexString()
    request(app)
      .delete(`${prefix}/categories/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.category._id).toBe(hexId)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Category.findById(hexId).then((categories) => {
          expect(categories).toBeFalsy()
          done()
        }).catch((e) => done(e))
      })
  })

  it('should not remove category if user role is not admin', (done) => {
    const hexId = categories[0]._id.toHexString()
    request(app)
      .delete(`${prefix}/categories/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Category.findById(hexId).then((categories) => {
          expect(categories).toBeTruthy()
          done()
        }).catch((e) => done(e))
      })
  })
})
