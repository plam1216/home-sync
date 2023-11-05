import express from 'express'
import { createListing, deleteListing } from '../controllers/listing.js'
import { verifyToken } from '../utils/verifyUser.js'

const listingsRouter = express.Router()

listingsRouter.post('/create', verifyToken, createListing)
listingsRouter.delete('/delete/:id', verifyToken, deleteListing)

export default listingsRouter