import express from 'express'
import user from './user'
const router = express.Router()

router.route('/').get((req, res) => {
  res.send('Root route')
})

router.use('/users', user)

export default router
