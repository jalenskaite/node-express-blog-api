import expect from 'expect'
import request from 'supertest'

import app from './../server'
// import {Comment} from './../models/comment'
import {users, populateUsers} from './../seed/test/user'
import {populatePosts, postId1, postId2} from './../seed/test/post'
import {
  comments,
  populateComments,
  commentId1,
  commentId6,
  commentId7
} from './../seed/test/comment'

const prefix = '/api'

beforeEach(populateUsers)
beforeEach(populatePosts)
beforeEach(populateComments)

describe(`GET ${prefix}/comments`, () => {
  it('should get all comments of post if no parentId', (done) => {
    request(app)
      .get(`${prefix}/comments`)
      .query({
        postId: postId1.toString()
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.comments.length).toBe(2)
      })
      .end(done)
  })

  it('should get all comment replies of post if is exist', (done) => {
    request(app)
      .get(`${prefix}/comments`)
      .query({
        postId: postId1.toString(),
        id: commentId1.toString()
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.comments.length).toBe(3)
      })
      .end(done)
  })

  it('should return zero comments if postId/parentId is wrong', (done) => {
    request(app)
      .get(`${prefix}/comments`)
      .query({
        postId: 4545556,
        parentId: 545454
      })
      .expect(404)
      .expect((res) => {
        expect(res.body.comments.length).toBe(0)
      })
      .end(done)
  })

  it('should return 404 if no postId', (done) => {
    request(app)
      .get(`${prefix}/comments`)
      .expect(404)
      .expect((res) => {
        expect(res.body.comments.length).toBe(0)
      })
      .end(done)
  })
})

describe(`GET ${prefix}/comments/me`, () => {
  it('should get all user comments', (done) => {
    request(app)
      .get(`${prefix}/comments/me`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.comments.length).toBe(4)
      })
      .end(done)
  })

  it('should return 401 if not authenticate', (done) => {
    request(app)
      .get(`${prefix}/comments/me`)
      .expect(401)
      .end(done)
  })
})

describe(`GET ${prefix}/comments/all`, () => {
  it('if user  admin should return all comments', (done) => {
    request(app)
      .get(`${prefix}/comments/all`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.comments.length).toBe(comments.length)
      })
      .end(done)
  })

  it('if user not admin should return 401', (done) => {
    request(app)
      .get(`${prefix}/comments/all`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(401)
      .end(done)
  })
})

describe(`POST ${prefix}/comments`, () => {
  it('should add comment or reply if data correct', (done) => {
    const send = {
      title: 'some title',
      text: 'some comment',
      postId: postId2.toString()
    }
    request(app)
      .post(`${prefix}/comments`)
      .send(send)
      .expect(200)
      .expect((res) => {
        expect(res.body.comment.text).toBe(send.text)
        expect(res.body.comment.title).toBe(send.title)
        expect(res.body.comment.postId).toBe(send.postId)
      })
      .end(done)
  })

  it('should return 400 if title/text/postId not exist', (done) => {
    request(app)
      .post(`${prefix}/comments`)
      .expect(400)
      .end(done)
  })
})

describe(`DELETE ${prefix}/comments/:id`, () => {
  it('should delete comment if useri is creator', (done) => {
    request(app)
      .delete(`${prefix}/comments/${commentId7.toString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.comment.text).toBe(comments[6].text)
        expect(res.body.comment.title).toBe(comments[6].title)
        expect(res.body.comment.postId).toBe(comments[6].postId.toString())
      })
      .end(done)
  })

  it('should get 400 if user is not creator', (done) => {
    request(app)
      .delete(`${prefix}/comments/${commentId7.toString()}`)
      .set('x-auth', users[3].tokens[0].token)
      .expect(400)
      .end(done)
  })

  it('should delete any comment if useri is admin', (done) => {
    request(app)
      .delete(`${prefix}/comments/${commentId6.toString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.comment.text).toBe(comments[5].text)
        expect(res.body.comment.title).toBe(comments[5].title)
        expect(res.body.comment.postId).toBe(comments[5].postId.toString())
      })
      .end(done)
  })
})
