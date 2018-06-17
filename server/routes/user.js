import express from 'express'
import {get, create, login, logout} from './../controllers/user'
import authenticate from './../middleware/authenticate'
const router = express.Router()

router.route('/').post(create)
router.route('/me').get(authenticate, get)
router.route('/login').post(login)
router.route('/logout').delete(authenticate, logout)

export default router
