import express from 'express'
import { test } from '../controllers/users.js'

const usersRouter = express.Router()

usersRouter.post('', (req, res) => { })

usersRouter.get('/test', test)
usersRouter.get('', (req, res) => { })
usersRouter.post('', (req, res) => { })
usersRouter.delete('', (req, res) => { })

export default usersRouter