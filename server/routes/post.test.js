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

describe(`PATCH ${prefix}/posts/:id`, () => {
  it('should update the post', (done) => {
    const hexId = posts[0]._id.toHexString()
    const text = 'Updated first post text'
    const title = 'Updated first post title'
    request(app)
      .patch(`${prefix}/posts/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        title,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.post.text).toBe(text)
        expect(res.body.post.title).toBe(title)
      })
      .end(done)
  })

  it('should not update the post as other user', (done) => {
    const hexId = posts[0]._id.toHexString()
    const text = 'Updated first post text'
    const title = 'Updated first post title'
    request(app)
      .patch(`${prefix}/posts/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        title,
        text
      })
      .expect(404)
      .end(done)
  })
})

describe(`DELETE ${prefix}/posts/:id`, () => {
  it('should remove the post', (done) => {
    const hexId = posts[0]._id.toHexString()
    request(app)
      .delete(`${prefix}/posts/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.post._id).toBe(hexId)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Post.findById(hexId).then((posts) => {
          expect(posts).toBeFalsy()
          done()
        }).catch((e) => done(e))
      })
  })

  it('should not remove the post for other user', (done) => {
    const hexId = posts[0]._id.toHexString()
    request(app)
      .delete(`${prefix}/posts/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Post.findById(hexId).then((posts) => {
          expect(posts).toBeTruthy()
          done()
        }).catch((e) => done(e))
      })
  })

  it('should return 404 if post not found', (done) => {
    const id = new ObjectID()
    request(app)
      .delete(`${prefix}/posts/${id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done)
  })

  it('should return 404 if object id is not valid', (done) => {
    const id = '123412sfdfasfasd'
    request(app)
      .delete(`${prefix}/posts/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done)
  })
})
