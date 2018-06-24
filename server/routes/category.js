import express from 'express'
import {get, create, update, remove} from './../controllers/category'
import authenticate from './../middleware/authenticate'
const router = express.Router()

router.route('/').post(authenticate, create)
router.route('/').get(get)
router.route('/:id').patch(authenticate, update)
router.route('/:id').delete(authenticate, remove)

export default router
