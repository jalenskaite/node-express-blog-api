import expect from 'expect'
import request from 'supertest'

import app from './../server'
// import {User} from './../models/user'
import {Post} from './../models/post'
import {users, populateUsers} from './../seed/test/user'
import {populatePosts} from './../seed/test/post'

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
