import expect from 'expect'
import request from 'supertest'

import app from './../server'
// import {User} from './../models/user'
import {ObjectID} from 'mongodb'
import {Post} from './../models/post'
import {users, populateUsers} from './../seed/test/user'
import {posts, populatePosts} from './../seed/test/post'

const prefix = '/api'

beforeEach(populateUsers)
beforeEach(populatePosts)

describe(`POST ${prefix}/posts`, () => {
  it('should create a new post', (done) => {
    const text = 'Test post text'
    const title = 'Test post title'
    request(app)
      .post(`${prefix}/posts`)
      .set('x-auth', users[0].tokens[0].token)
      .send({ text, title })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err) => {
        if (err) {
          return done(err)
        }

        Post.find({text}).then((posts) => {
          expect(posts.length).toBe(1)
          expect(posts[0].text).toBe(text)
          done()
        }).catch((e) => done(e))
      })
  })

  it('should not create post with invalid body data', (done) => {
    request(app)
      .post(`${prefix}/posts`)
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err)
        }

        Post.find().then((posts) => {
          expect(posts.length).toBe(2)
          done()
        }).catch((e) => done(e))
      })
  })
})

describe(`GET ${prefix}/posts`, () => {
  it('should get posts', (done) => {
    request(app)
      .get(`${prefix}/posts`)
      .expect(200)
      .end((err) => {
        if (err) {
          return done(err)
        }

        Post.find().then((posts) => {
          expect(posts.length).toBeLessThan(11)
          done()
        }).catch((e) => done(e))
      })
  })

  it('should skip and get limitted list with params ', (done) => {
    request(app)
      .get(`${prefix}/posts`)
      .query({limit: 1, start: 1})
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(1)
        expect(res.body[0].text).toBe(posts[1].text)
      })
      .end(done)
  })

  it('should default params overide invalid params ', (done) => {
    request(app)
      .get(`${prefix}/posts`)
      .query({limit: 'fsd', start: 'fff'})
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBeGreaterThan(1)
        expect(res.body[0].text).toBe(posts[0].text)
      })
      .end(done)
  })
})

describe(`GET ${prefix}/posts/:id`, () => {
  it('should return post doc', (done) => {
    request(app)
      .get(`${prefix}/posts/${posts[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.post.text).toBe(posts[0].text)
      })
      .end(done)
  })

  it('should return 404 if post was not found', (done) => {
    const id = new ObjectID()
    request(app)
      .get(`${prefix}/posts/${id.toHexString()}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 for non-object ids', (done) => {
    const id = '123412sfdfasfasd'
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done)
  })
})
