import User from '../models/user.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const signup = async (req, res, next) => {
    // assign req.body values to respective variables
    const { username, email, password } = req.body

    // encrypt password
    const hashedPassword = bcryptjs.hashSync(password, 10)

    // create User with encrypted password
    const newUser = new User({ username, email, password: hashedPassword })

    try {
        // save to MongoDB
        await newUser.save()

        res.status(201).json("User created successfully!")
    } catch (err) {
        // if duplicate User exists give error
        // res.status(500).json(err.message)

        // handle error with middleware and errorHandler util
        // next(errorHandler(550, 'error from error.js'))
        next(err)
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body

    try {
        // check if email exists
        const validUser = await User.findOne({ email: email })

        // User doens't exist, run next middleware
        if (!validUser) return next(errorHandler(404, 'User not found!'))

        const validPassword = bcryptjs.compareSync(password, validUser.password)

        // if invalid password
        if (!validPassword) return next(errorHandler(401, 'Invalid email or password!'))

        // if id is equal to MongoDB id
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)

        // store all but password into "rest"
        const { password: pass, ...rest } = validUser._doc

        // save token as a cookie named 'access_token'
        // httpOnly : true;  no other 3rd party apps have access to cookie
        res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            // .json(validUser)
            // for security don't show password when sending back data
            .json(rest)

    } catch (err) {
        next(err)
    }
}