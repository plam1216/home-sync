import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'

// Routes
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js'

dotenv.config()

const app = express();
const PORT = 3000


// connect to MongoDB
mongoose
.connect(process.env.DATABASE_URL)
.then(() => {
    console.log('Connected to MongoDB')
})
.catch(() => {
    console.log(err)
})


app.listen(PORT, () => {
    console.log('Listening on PORT', PORT)
})

// Middleware
// read JSON data from HTTP requests
app.use(express.json())

app.use('/api/user', usersRouter)
app.use('/api/auth', authRouter)

// handle possible errors
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})