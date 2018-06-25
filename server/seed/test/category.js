import {ObjectID} from 'mongodb'
import {userOneId, userTwoId, userThreeId} from './user'
import {Category} from './../../models/category'

const categories = [{
  _id: new ObjectID(),
  name: 'Categiry #1',
  _creator: userOneId
}, {
  _id: new ObjectID(),
  name: 'Categiry #2',
  _creator: userTwoId
},
{
  _id: new ObjectID(),
  name: 'Categiry #3',
  _creator: userThreeId
}]

const populateCategories = (done) => {
  Category.remove({}).then(() => {
    Category.insertMany(categories)
  }).then(() => done())
}

export {categories, populateCategories}
