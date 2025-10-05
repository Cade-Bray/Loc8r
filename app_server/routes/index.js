const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations')
const ctrlOthers = require('../controllers/others')
const {route} = require("express/lib/application");

/* Locations pages */
router.get('/', ctrlLocations.homelist);
router.get('/location/:store', ctrlLocations.locationInfo);
router
    .route('/location/:store/review/new')
    .get(ctrlLocations.addReview)
    .post(ctrlLocations.doAddReview);

/* Other pages */
router.get('/about', ctrlOthers.about);

module.exports = router;
