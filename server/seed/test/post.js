import {ObjectID} from 'mongodb'
import {userOneId, userTwoId} from './user'
import {Post} from './../../models/post'

const posts = [{
  _id: new ObjectID(),
  text: 'First post text',
  title: 'First post title',
  _creator: userOneId
}, {
  _id: new ObjectID(),
  text: 'Second post text',
  title: 'Second post title',
  _creator: userTwoId
}]

const populatePosts = (done) => {
  Post.remove({}).then(() => {
    Post.insertMany(posts)
  }).then(() => done())
}

export {posts, populatePosts}
