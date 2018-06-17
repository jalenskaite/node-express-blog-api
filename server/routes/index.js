import express from 'express'
import user from './user'
import post from './post'
const router = express.Router()

router.route('/').get((req, res) => {
  res.send('Root route')
})

router.use('/users', user)
router.use('/posts', post)

export default router
