const request = require('request');
if (process.env.NODE_ENV === 'production') {
    const apiOptions = {
        server: 'https://loc8r.cadebray.com'
    };
} else {
    const apiOptions = {
        server: 'http://localhost:3000'
    };
}

/**
 * This function renders the homepage. There is no routes to this function but the controller that is routed can invoke 
 * this render function.
 * @param req Express requirements that are passed from a routed controller.
 * @param res Express response that are passed from a routed controller.
 */
function renderHomepage(req, res) {
    res.render('locations-list', {
        title: 'Home',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        locations: [
            {
                name: 'Starcups',
                address: '125 High Street, Reading, RG6 1PS',
                rating: 3,
                facilities: ['Hot drinks', 'Food', 'Premium wifi'],
                distance: '100m'
            },
            {
                name: 'Cafe Hero',
                address: '125 High Street, Reading, RG6 1PS',
                rating: 4,
                facilities: ['Hot drinks', 'Food', 'Premium wifi'],
                distance: '200m'
            },
            {
                name: 'Burger Queen',
                address: '125 High Street, Reading, RG6 1PS',
                rating: 2,
                facilities: ['Food', 'Premium wifi'],
                distance: '250m'
            }
        ]
    })
}

/* ROUTED CONTROLLERS BEYOND THIS POINT. RENDER AND HELPER FUNCTIONS ABOVE THIS POINT */

/**
 * GET the homepage. This page will render the homepage.
 * @param req Express provided requirements.
 * @param res Express provided response. This will be used for rendering.
 */
function homelist(req, res) {
    renderHomepage(req, res);
}

/**
 * GET the location information.
 * @param req Express provided requirements.
 * @param res Express provided response. This will be used for rendering.
 */
function locationInfo(req, res) {
    res.render('location-info', {title: 'Location info'});
}

/**
 * GET the add review page.
 * @param req Express provided requirements.
 * @param res Express provided response. This will be used for rendering.
 */
function addReview(req, res) {
    res.render('location-review-form', {title: 'Add review'});
}


/* MODULE EXPORTS, END OF FILE */
module.exports = {
    homelist,
    locationInfo,
    addReview
};