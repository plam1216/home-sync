import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import usersRouter from './routes/users.js';

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

app.use('/api/user', usersRouter)