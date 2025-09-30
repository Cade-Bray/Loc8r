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
                "message": "Unknown server error for locationsReadOne."
            });
            break;
    }
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