import mongoose from "mongoose";

const openingTimeSchema = new mongoose.Schema({
    days: {
        type: String,
        required: true
    },
    opening: String,
    closing: String,
    closed: {
        type: Boolean,
        required: true
    }
});

const customerReviewSchema = new mongoose.Schema({
    author: {type: String, required: true},
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    createdOn: {
        type: Date,
        required: true,
        'default': Date.now()
    },
    reviewText: String
});

const locationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    address: String,
    rating: {
        type: String,
        'default': 0,
        min: 0,
        max: 5
    },
    facilities: [String],
    coords: {
        type: {type: String},
        coordinates: [Number]
    },
    openingTimes: [openingTimeSchema],
    reviews: [customerReviewSchema]
});

// This is important because it enables mongodb to calculate geometries based on a spherical object.
locationSchema.index({coords: '2dsphere'});

mongoose.model('Location', locationSchema);

