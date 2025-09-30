const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

function reviewsCreate(req, res) {
    res
        .status(200)
        .json({"status" : "success"});
}

async function reviewsReadOne(req, res) {
    try {
        // Using a var because it allows us to leave the scope of the try/catch later. let and const can't do that.
        var monReview = await Loc
            .findById(req.params.locationid) // Getting the location document
            .select('name reviews')     // Get the reviews subdocument
            .where('reviews')
            .elemMatch({$eq: })
            .exec();                         // Execute the query
        
    } catch ({type, message}) {
        // Mongoose or the mongodb connection has failed. Returning 500 and error message.
        return res.status(500).json({
            'type': type,
            'message': message
        });
    }
    
    // Switch case so we can easily add more HTTP responses as needed later. The order is as intended for functionality.
    switch (monReview) {

        // 404 the json provided back was empty.
        case !monReview:
            return res.status(404).json({
                "message": "reviews not found"
            });

        // 404 the json provided bas was null instead. Needs to be before 200 case.
        case null:
            return res.status(404).json({
                "message": "reviews not found"
            });

        // Location found! Return 200 and the JSON
        case monReview:
            const review = {};
            
            // Error checking to ensure the review is present
            if (!review){
                // It wasn't present so send a 404 review not found
                return res.status(404).json({
                    "message": "review not found"
                });
            } else {
                // There was a review with that ID. 200 with the review
                return res.status(200).json({review});
            }
        
        // Default case to internal server error.
        default:
            return res.status(500).json({
                "message": "Unknown server error for reviewsReadOne."
            });
    }
}

function reviewsUpdateOne(req, res) {
    res
        .status(200)
        .json({"status" : "success"});
}

function reviewsDeleteOne(req, res) {
    res
        .status(200)
        .json({"status" : "success"});
}

module.exports = {
    reviewsCreate,
    reviewsReadOne,
    reviewsUpdateOne,
    reviewsDeleteOne
}