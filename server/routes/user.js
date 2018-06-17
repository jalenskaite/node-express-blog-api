import express from 'express'
import {get, create, login, logout} from './../controllers/user'
const router = express.Router()

router.route('/').post(create)
router.route('/me').get(get)
router.route('/login').post(login)
router.route('/logout').delete(logout)

export default router
