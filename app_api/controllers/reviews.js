function reviewsCreate(req, res) {
    res
        .status(200)
        .json({"status" : "success"});
}

function reviewsReadOne(req, res) {
    res
        .status(200)
        .json({"status" : "success"});
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