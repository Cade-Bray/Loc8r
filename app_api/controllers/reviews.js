const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

/**
 * This function will create a review subdocument and add to a valid location.
 * @param req This is the express requirements. Used for params locationid and req.body information.
 * @param res This is the express response. 201/404/500
 * @return {Promise<*>} Provided with an HTTP response of 201 for created, 404 for location not found, and 500 internal.
 */
async function reviewsCreate(req, res) {
    try {
        if (req.params.locationid) {
            const store = await Loc
                .findById(req.params.locationid)
                .select('reviews')
                .exec();

            const subDocument = store.reviews.create(req.body);
            store.reviews.push(subDocument);

            await store.save(); // Save the subdocument to the document. It isn't automatically saved.
            
            // Update the average
            await updateAverageRating(req, res, store);
            
            return res.status(201).json(subDocument);
        } else {
            // Location was not provided.
            return res.status(404).json({'message': 'Location ID was invalid.'})
        }
    } catch ({name, message}) {
        // System failed and needs a 500 status code with error type and message.
        return res.status(500).json({'type': name, 'message': message});
    }
}

/**
 * This function will return a payload and the name of the location, its id, and the review that matched.
 * @param req This is the express provided requirements. This is where parameters are taken.
 * @param res This is the express provided response. An HTTP status code and JSON will be packed in the response. 
 * @return {Promise<*>} You may receive a 200, 404, or 500 HTTP status with JSON.
 */
async function reviewsReadOne(req, res) {
    try {
        const store = await Loc
            .findById(req.params.locationid)
            .select('name reviews')
            .exec();
        
        // Check if location is found
        if (!store) {
            return res.status(404).json({'message': 'Location was not found.'});
        }

        let review = store.reviews.id(req.params.reviewid);
        // Check if review is present
        if (!review) {
            return res.status(404).json({'message': 'Review was not found.'})
        }
        
        
        // Passed checks to ensure that the response json is good. Return what we have and 200.
        return res.status(200).json({
            'location': {
                'name': store.name,
                '_id': req.params.locationid
            },
            review
        });
        
    } catch ({type, message}) {
        // Mongoose or the mongodb connection has failed. Returning 500 and error message.
        return res.status(500).json({
            'type': type,
            'message': message
        });
    }
}

/**
 * This function when routed to and provided with a locationid and reviewid will update the review.
 * @param req This is the express provided requirements. Used for parameter gathering and body form info.
 * @param res This is the express provided response. Used to pack HTTP status codes and JSON data.
 * @return {Promise<*>} This function will return a response packed with 200/400/404/500 status and json response.
 */
async function reviewsUpdateOne(req, res) {
    try {
        // Error trap for locationid and reviewid not provided.
        if (!req.params.locationid || !req.params.reviewid) {
            return res.status(400).json({'message': 'Bad request, Check your locationid and reviewid.'})
        }

        const store = await Loc
            .findById(req.params.locationid)
            .select('reviews')
            .exec();

        // Error trap for not finding a store.
        if (!store) {
            return res.status(400).json({'message': 'Location not found.'});
        }
        
        // Error trapping for the reviews section
        if (store.reviews && store.reviews.length > 0) {
            const thisReview = store.reviews.id(req.params.reviewid);
            
            // Error trap for specific id
            if (!thisReview) {
                return res.status(404).json({'message': 'review not found'});
            } else {
                // All error trapping is done. Update the review, save, update average, and send response.
                thisReview.author = req.body.author;
                thisReview.rating = req.body.rating;
                thisReview.reviewText = req.body.reviewText;
                
                await store.save();
                
                await updateAverageRating(store);
                
                return res.status(200).json(thisReview);
            }
        }
    } catch ({name, message}) {
        // There was an internal error. Pack it and send 500
        return res.status(500).json({'type': name, 'message': message});
    }
}

/**
 * This function when routed to will take a locationid and reviewid and delete the review.
 * @param req This is the express provided requirements. This is used to unpack the parameters.
 * @param res This is the express provided response. This is used to pack an HTTP status and JSON data.
 * @return {Promise<*>} This function will return a 204/400/404/500. 204 on successful deletion.
 */
async function reviewsDeleteOne(req, res) {
    try {
        const {locationid, reviewid} = req.params;

        // Error trapping, check if locationid and reviewid are provided.
        if (!locationid || !reviewid) {
            return res.status(404).json({'message': 'Not found, check your locationid or reviewid.'});
        }

        const store = await Loc
            .findById(locationid)
            .select('reviews')
            .exec();

        // Error trapping to ensure that the store was found.
        if (!store) {
            return res.status(400).json({'message': 'There is no store associated to that locationid.'});
        }

        // Error trapping to catch when no reviews are on a location to prevent an assignment of a reviewid
        if (store.reviews && store.reviews.length > 0) {
            // Passed all error traps so let's delete the review.
            const thisReview = await store.reviews.id(reviewid);
            const reviewIndex = store.reviews.indexOf(thisReview);
            store.reviews.splice(reviewIndex);
            await store.save();
            await updateAverageRating(store);
            return res.status(204).json(null);
        } else {
            // There isn't any reviews or the document reviews is undefined.
            return res.status(400).json({'message': 'Check location id, there are no reviews for this location.'});
        }
    } catch ({name, message}) {
        // Internal server error
        return res.status(500).json({'type': name, 'message': message});
    }
}

/**
 * This function isn't an open API call. This function can be called by any other API route to update the average.
 * @param location This is the location object that needs its average updated.
 */
async function updateAverageRating(location) {
    if (location.reviews && location.reviews.length > 0) {
        const total = location.reviews.reduce((acc, {rating}) => {
            return acc + rating;
        }, 0);
        
        location.rating = parseInt(total / location.reviews.length, 10);
        await location.save();
    }
}

module.exports = {
    reviewsCreate,
    reviewsReadOne,
    reviewsUpdateOne,
    reviewsDeleteOne
}