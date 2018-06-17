import mongoose from 'mongoose'

const db = () => {
  mongoose.Promise = global.Promise
  mongoose.connect(process.env.MONGODB_URI)
}

export default db
