import {ObjectID} from 'mongodb'
import {userOneId, userTwoId} from './user'
import {Post} from './../../models/post'

const postId1 = new ObjectID()
const postId2 = new ObjectID()

const posts = [{
  _id: postId1,
  text: 'First post text',
  title: 'First post title',
  _creator: userOneId.toString()
}, {
  _id: postId2,
  text: 'Second post text',
  title: 'Second post title',
  _creator: userTwoId.toString()
}]

const populatePosts = (done) => {
  Post.remove({}).then(() => {
    Post.insertMany(posts)
  }).then(() => done())
}

export {posts, populatePosts, postId1, postId2}
