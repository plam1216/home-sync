import Listing from "../models/listing.js"

export const createListing = async (req, res, next) => {
    try {
        // const listing = await Listing.create(req.body)
        const listing = new Listing(req.body)

        await listing.save()

        return res.status(201).json(listing)
    } catch (err) {
        next(err)
    }
}