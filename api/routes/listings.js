import express from 'express'
import { createListing } from '../controllers/listing.js'

const listingsRouter = express.Router()

listingsRouter.post('/create', createListing)

export default listingsRouter