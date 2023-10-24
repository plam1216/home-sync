import express from 'express'
import { signup } from '../controllers/auth.js'

const authRouter = express()

authRouter.get('/signup', signup)
authRouter.post('/signup', signup)

export default authRouter