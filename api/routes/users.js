import express from 'express'
import { test, updateUser } from '../controllers/users.js'
import { verifyToken } from '../utils/verifyUser.js'

const usersRouter = express.Router()

usersRouter.get('/test', test)
usersRouter.post('/update/:id', verifyToken, updateUser)

export default usersRouter