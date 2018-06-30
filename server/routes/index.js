import express from 'express'
import user from './user'
import post from './post'
import category from './category'
import comment from './comment'
const router = express.Router()

router.route('/').get((req, res) => {
  res.send('Root route')
})

router.use('/users', user)
router.use('/posts', post)
router.use('/categories', category)
router.use('/comments', comment)

export default router
