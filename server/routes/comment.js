import express from 'express'
import {get, getMe, getAll, create, remove} from './../controllers/comment'
import authenticate from './../middleware/authenticate'
import user from './../middleware/user'
const router = express.Router()

router.route('/').get(get)
router.route('/me').get(authenticate, getMe)
router.route('/all').get(authenticate, getAll)
router.route('/').post(user, create)
router.route('/:id').delete(authenticate, remove)

export default router
