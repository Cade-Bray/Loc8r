const request = require('request');
let apiOptions ={}
if (process.env.NODE_ENV === 'production') {
    apiOptions = { server: 'https://loc8r.cadebray.com' };
} else {
    apiOptions = { server: 'http://localhost:3000' };
}

/**
 * This function renders the homepage. There is no routes to this function but the controller that is routed can invoke
 * this render function.
 * @param req Express requirements that are passed from a routed controller.
 * @param res Express response that are passed from a routed controller.
 * @param responseBody This is the provided response body from the request() function we're wrapping the render within.
 */
function renderHomepage(req, res, responseBody) {
    res.render('locations-list', {
        title: 'Home',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with ' +
            'coffee, cake or a pint? Let Loc8r help you find the place you\'re looking for.',
        locations: responseBody.results
    })
}

/**
 * This function renders the review page. This function shouldn't be routed to directly but called within a controller.
 * @param req This is the express provided parameter for the requirements.
 * @param res This is the express provided parameter for the response.
 * @param responseBody This is the response body from the controller api call for the location.
 */
function renderReviewPage(req, res, responseBody) {
    res.render('location-review-form', {title: `Review ${responseBody.name}`, name: responseBody.name});
}

/**
 * This function renders the location information page. There shouldn't be a route to this function directly but this is
 * invoked from a controller.
 * @param req This is the Express requirements that are passed.
 * @param res This is the Express response that are passed.
 * @param responseBody This is the response body containing all the information from the database.
 */
function renderLocationInfo(req, res, responseBody){
    res.render('location-info', {title: `${responseBody.name} info`, responseBody});
}

/**
 * This function encapsulates the logic for making an API call for location.js functions. This is a helper function.
 * @param req Express provided requirements. Passed along to callback as `callback(req, res, body)`
 * @param res Express provided response. Passed along to callback.
 * @param path This is the path for the api call appended to the apiOptions.server defined at the top of the file.
 * @param callback This is the callback for the rendering of a page function.
 */
function getLocationInformation(req, res, path, callback) {
    // These are the request options.
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {},
        qs: {
            lat: 40.768441835109385,
            lng: -111.88894128847757,
            maxDistance: 100
        }
    };

    // Make the API call
    request(
        requestOptions,
        (err, response, body) => {
            callback(req, res, body);
        }
    );
}

/**
 * This is a helper function for handling status code errors.
 * @param req Express provided requirements.
 * @param res Express provided response.
 * @param status Status code as an integer.
 */
function showError(req, res, status) {
    let title = '';
    let content = '';

    if (status === 404) {
        title = '404, page not found';
        content= 'Oh dear. Looks like you can\'t find this page. Sorry.';
    } else {
        title = `${status}, something's gone wrong`;
        content = 'Something, somewhere, somehow has gone just a little bit wrong. Contact the site administrators.';
    }

    res.status(status);
    res.render('generic-text', {
        title,
        content
    });
}

/* ROUTED CONTROLLERS BEYOND THIS POINT. RENDER AND HELPER FUNCTIONS ABOVE THIS POINT */

/**
 * GET the homepage. This page will render the homepage.
 * @param req Express provided requirements.
 * @param res Express provided response. This will be used for rendering.
 */
function homelist(req, res) {
    const path = '/api/locations'; // The API path
    getLocationInformation(req, res, path, renderHomepage);
}

/**
 * GET the location information.
 * @param req Express provided requirements.
 * @param res Express provided response. This will be used for rendering.
 */
function locationInfo(req, res) {
    const path = `/api/locations/${req.params.store}`; // The API path
    getLocationInformation(req, res, path, renderLocationInfo);
}

/**
 * GET the add review page.
 * @param req Express provided requirements.
 * @param res Express provided response. This will be used for rendering.
 */
function addReview(req, res) {
    const path = `/api/locations/${req.params.store}`; // The API path
    getLocationInformation(req, res, path, renderReviewPage);
}

function doAddReview(req, res){
    const locationId = req.params.store;
    const path = `/api/locations/${req.params.store}/reviews`; // The API path
    
    const postData = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        reviewText: req.body.review
    };
    
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'POST',
        json: postData
    };
    
    console.log(locationId);
    
    request(
        requestOptions,
        (err, {statusCode}, body) => {
            if(statusCode === 201) {
                console.log(locationId);
                res.redirect(`/location/${locationId}`);
            } else {
                showError(req, res, statusCode);
            }
        }
    );
}


/* MODULE EXPORTS, END OF FILE */
module.exports = {
    homelist,
    locationInfo,
    addReview,
    doAddReview
};