import {ObjectID} from 'mongodb'
import {userOneId, userTwoId} from './user'
import {postId1, postId2} from './post'
import {Comment} from './../../models/comment'

const commentId1 = new ObjectID()
const commentId2 = new ObjectID()
const commentId3 = new ObjectID()
const commentId4 = new ObjectID()
const commentId5 = new ObjectID()
const commentId6 = new ObjectID()
const commentId7 = new ObjectID()

const comments = [{
  _id: commentId1,
  title: 'Comment title 1',
  text: 'Comment text 1',
  postId: postId1,
  _creator: userOneId
}, {
  _id: commentId2,
  title: 'Comment title 1 2',
  text: 'Comment text 1 2',
  postId: postId1,
  parentId: commentId1,
  _creator: userOneId
}, {
  _id: commentId3,
  title: 'Comment title 1 3',
  text: 'Comment text 1 3',
  postId: postId1,
  parentId: commentId1
}, {
  _id: commentId4,
  title: 'Comment title 1 4',
  text: 'Comment text 1 4',
  postId: postId1,
  parentId: commentId1,
  _creator: userOneId
},
{
  _id: commentId5,
  title: 'Comment title 1 5',
  text: 'Comment text 1 5',
  postId: postId1,
  _creator: userOneId
}, {
  _id: commentId6,
  title: 'Comment title 6',
  text: 'Comment text 6',
  postId: postId2
}, {
  _id: commentId7,
  title: 'Comment title 1 7',
  text: 'Comment text 1 7',
  postId: postId2,
  parentId: commentId6,
  _creator: userTwoId
}]

const populateComments = (done) => {
  Comment.remove({}).then(() => {
    Comment.insertMany(comments)
  }).then(() => done())
}

export {
  comments,
  populateComments,
  commentId1,
  commentId2,
  commentId3,
  commentId4,
  commentId5,
  commentId6,
  commentId7
}
