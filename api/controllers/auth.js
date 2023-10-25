import User from '../models/user.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'

export const signup = async (req, res, next) => {
    // assign req.body values to respective variables
    const { username, email, password } = req.body

    // encrypt password
    const hashedPassword = bcryptjs.hashSync(password, 10)

    // create User using info
    // const newUser = new User({ username, email, password })
    const newUser = new User({ username, email, password: hashedPassword })

    try {
        // save to MongoDB
        await newUser.save()
        res.status(201).json("User created successfully!")
    } catch (err) {
        // if duplicate User exists give error
        // res.status(500).json(err.message)

        // handle error with middleware and errorHandler util
        next(errorHandler(550, 'error from error.js'))
    }
}