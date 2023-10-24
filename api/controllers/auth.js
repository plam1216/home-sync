import User from '../models/user.js'
import bcryptjs from 'bcryptjs'

export const signup = async (req, res) => {
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
        // duplicate User exists
        res.status(500).json(err.message)
    }

}