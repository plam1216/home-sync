import express from 'express'
import { test, updateUser, deleteUser } from '../controllers/users.js'
import { verifyToken } from '../utils/verifyUser.js'

const usersRouter = express.Router()

usersRouter.get('/test', test)
usersRouter.post('/update/:id', verifyToken, updateUser)
usersRouter.delete('/delete/:id', verifyToken, deleteUser)

export default usersRouter