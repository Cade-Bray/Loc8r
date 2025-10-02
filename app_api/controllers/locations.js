const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

/**
 * This function will provide a response with a payload array of the closest stores to your location.
 * @param req This is the express server requirements. Parameters and queries are pulled from here.
 * @param res This is the express server response. A status code and JSON is packed and returned. 
 * @return {Promise<*>} 200/500. Array of locations sorted by distance.
 */
async function locationsListByDistance(req, res) {
    try {
        const lng = parseFloat(req.query.lng);
        const lat = parseFloat(req.query.lat);

        const near = {
            type: "Point",
            coordinates: [lng, lat]
        };
        
        const results = await Loc.aggregate([
            {
                $geoNear: {
                    near,
                    distanceField: 'distance.calculated',
                    spherical: true,
                    maxDistance: 20000
                }
            },
            {$limit: 100}
        ]);
        
        // Convert the meters to miles
        const conversion_unit = 0.000621371; // Multiply your meters by this to get the miles.
        for (let i = 0; i < results.length; i++) {
            results[i].distance.calculated *= conversion_unit;
        }
        
        return res.status(200).json({results});
    } catch ({type, message}) {
        // Mongoose or the mongodb connection has failed. Returning 500 and error message.
        return res.status(500).json({
            'type': type,
            'message': message
        });
    }
}

/**
 * This function will make a post request to create a location given x-www-form-urlencoding for the body.
 * @param req This is the express requirements. Body attributes are pulled from the form to be filled.
 * @param res This is the express response. 201/404/500 Status with message and/or an ID
 * @return {*} This item will return 201, message, and ID of the object created. 404 on schema validation errors with
 *              messages. 500 on any unknown error with message and type.
 */
async function locationsCreate(req, res) {
    try {
        const store = await Loc.create({
            name: req.body.name,
            address: req.body.address,
            facilities: req.body.facilities.split(','),
            coords: [
                    parseFloat(req.body.lng),
                    parseFloat(req.body.lat)
            ],
            openingTimes: [
                {
                    days: req.body.days1,
                    opening: req.body.opening1,
                    closing: req.body.closing1,
                    closed: req.body.closed1
                },
                {
                    days: req.body.days2,
                    opening: req.body.opening2,
                    closing: req.body.closing2,
                    closed: req.body.closed2
                },
                {
                    days: req.body.days3,
                    opening: req.body.opening3,
                    closing: req.body.closing3,
                    closed: req.body.closed3
                }
            ]
        });
        return res.status(201).json({'message': 'Location created', id: store._id});
    } catch ({name, message}) {
        return res
            .status(name === 'ValidationError' ? 404 : 500) // Status code 404 when ValidationError; 500 everything else
            .json({'type': name, 'message': message}); // Error Type and message
    }
}

/**
 * Utilizes the Location database model. Provides the return of a location by a passed ID through the req parameters.
 * @param req Express passed requirements. Parameters will contain the location id for mongoose find by id.
 * @param res Expressed passed response. Status code will be appended and a json response for what was returned from
 *            mongoose find by id.
 * @return {Promise<void>} A 200 response provides a JSON of the location information.
 */
async function locationsReadOne(req, res) {
    try {
        var monLocation = await Loc.findById(req.params.locationid).exec(); //Get data from params and execute
    } catch ({name, message}) {
        // The Mongoose driver has failed. Report the type and message as 500 HTTP code.
        res.status(500).json({
            "type": name,
            "message": message
        });
        return;
    }
    
    
    // Switch case for various HTTP status codes to be added later if needed.
    switch (monLocation) {
        
        // 404 the json provided back was empty.
        case !monLocation:
            res.status(404).json({
                "message": "location not found"
            });
            break;
        
        // 404 the json provided bas was null instead. Needs to be before 200 case.
        case null:
            res.status(404).json({
                "message": "location not found"
            });
            break;
            
        // Location found! Return 200 and the JSON
        case monLocation:
            res.status(200).json(monLocation);
            break;
        
        // Default to an internal server error if previous cases were not matched. Should be matched previously.
        default:
            res.status(500).json({
                'message': 'Unknown server error for locationsReadOne.'
            });
            break;
    }
}

/**
 * This function when routed will update the location given a locationid and x-www-form-urlencoded form data.
 * @param req This is the express provided requirements. Used to capture body and parameter items.
 * @param res This is the express provided response. Status code and json will be packed as response.
 * @return {Promise<*>} 200/404/500 are possible codes. 200 for the form updating. 404 for bad locationid. 500 error catch.
 */
async function locationsUpdateOne(req, res) {
    try {
        // Error check. See if locationid was provided in the requirement parameters.
        if (!req.params.locationid) {
            return res.status(404).json({'message': 'Not found, locationid is required'});
        }
    
        const store = await Loc
            .findById(req.params.locationid)
            .select('-review -rating') // Don't grab these from the database.
            .exec();
    
        // Error check, make sure that a location document was returned for that locationid
        if (!store) {
            return res.status(404).json({'message': 'locationid not found'});
        }
        
        // Error trapping is complete so we can now start updating information of the document.
        store.name = req.body.name;
        store.address = req.body.address;
        store.facilities = req.body.facilities.split(',');
        store.coords = [
            parseFloat(req.body.lng),
            parseFloat(req.body.lat)
        ];
        store.openingTimes = [
            {
                days: req.body.days1,
                opening: req.body.opening1,
                closing: req.body.closing1,
                closed: req.body.closed1
            },
            {
                days: req.body.days2,
                opening: req.body.opening2,
                closing: req.body.closing2,
                closed: req.body.closed2
            },
            {
                days: req.body.days3,
                opening: req.body.opening3,
                closing: req.body.closing3,
                closed: req.body.closed3
            }
        ];
        
        // Save and send response
        await store.save();
        res.status(200).json({store});
    } catch ({name, message}) {
        // Internal error
        return res.status(500).json({'type': name, 'message': message});
    }
    
}

/**
 * This function when routed to will find and delete the location provided.
 * @param req This is the express provided requirements. Used to parse locationid from parameters.
 * @param res This is the express provided response. Used to pack an HTTP status code and JSON data.
 * @return {Promise<*>} This will return a 204/500 HTTP status response. 204 for successful deletion.
 */
async function locationsDeleteOne(req, res) {
    try {
        const {locationid} = req.params;
        if (locationid) {
            await Loc
                .findByIdAndDelete(locationid)
                .exec();

            return res.status(204).json(null);
        }
    } catch ({name, message}) {
        // Internal error reported.
        return res.status(500).json({'type': name, 'message': message});
    }
}

module.exports = {
    locationsListByDistance,
    locationsCreate,
    locationsReadOne,
    locationsUpdateOne,
    locationsDeleteOne
}