import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'

// Routes
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js'

dotenv.config()

const app = express();
const PORT = 3000

// Middleware
// read JSON data from HTTP requests
app.use(express.json())

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

app.use('/api/user', usersRouter)
app.use('/api/auth', authRouter)