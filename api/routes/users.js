import express from 'express'
import { test, updateUser, deleteUser, getUserListings } from '../controllers/users.js'
import { verifyToken } from '../utils/verifyUser.js'

const usersRouter = express.Router()

usersRouter.get('/test', test)
usersRouter.post('/update/:id', verifyToken, updateUser)
usersRouter.delete('/delete/:id', verifyToken, deleteUser)
usersRouter.get('/listings/:id', verifyToken, getUserListings)

export default usersRouter