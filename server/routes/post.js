import express from 'express'
import {getAll, get, getOne, create, update, remove} from './../controllers/post'
import authenticate from './../middleware/authenticate'
const router = express.Router()

router.route('/').post(authenticate, create)
router.route('/').get(getAll)
router.route('/me').get(get)
router.route('/:id').get(getOne)
router.route('/:id').patch(authenticate, update)
router.route('/:id').delete(authenticate, remove)

export default router
