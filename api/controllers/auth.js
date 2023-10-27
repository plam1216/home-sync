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

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            // create a unique token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

            // separate password
            const { password: pass, ...rest } = user._doc

            // create cookie named 'access_token' that contains user's data
            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest)
        } else {
            // create random password
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)

            // create a unique username
            const newUser = new User({
                username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-8),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo
            })

            await newUser.save()

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
            const { password: pass, ...rest } = newUser._doc
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest)

        }
    } catch (err) {
        next(err)
    }
}