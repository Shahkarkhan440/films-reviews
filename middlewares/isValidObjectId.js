
"use strict"
const ObjectId = require('mongoose').Types.ObjectId;
const { responseHandler } = require("../utilities/helper");

//this midddlware is used to check if the id is passed is valid Mongoose ObjectId or not
module.exports.isValidObjectId = async (req, res, next) => {
    if (!req.body.filmId) {
        return responseHandler(req, res, 406, {
            message: "Film id must need to be provided."
        });
    }
    else if (!ObjectId.isValid(req.body?.filmId)) {
        return responseHandler(req, res, 406, {
            message: "Invalid Film id provided."
        });
    } else {
        next()
    }
}
