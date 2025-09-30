const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

function locationsListByDistance(req, res) {
    res
        .status(200)
        .json({"status" : "success"});
}

function locationsCreate(req, res) {
    res
        .status(200)
        .json({"status" : "success"});
}

function locationsReadOne(req, res) {
    res
        .status(200)
        .json({"status" : "success"});
}

function locationsUpdateOne(req, res) {
    res
        .status(200)
        .json({"status" : "success"});
}

function locationsDeleteOne(req, res) {
    res
        .status(200)
        .json({"status" : "success"});
}

module.exports = {
    locationsListByDistance,
    locationsCreate,
    locationsReadOne,
    locationsUpdateOne,
    locationsDeleteOne
}