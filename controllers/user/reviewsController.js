"use strict"

const { Validator } = require('node-input-validator');
const { responseHandler, } = require("../../utilities/helper");
const { Film } = require("../../models/database")
const { usersLogger, errorLogger } = require("../../utilities/logger")

module.exports.addReview = async (req, res) => {
    try {

        const data = req.body;

        //validator class which validates incoming req data
        const validateReq = new Validator(data, {
            filmId: 'required|string',
            rating: `required|string|between:1,5`,
        });

        const matched = await validateReq.check();
        if (!matched) {
            return responseHandler(req, res, 400, {
                message: "Please fill all the required fields.", validationError: validateReq.errors
            });
        }

        const film = await Film.findById(data.filmId).lean()
        if (!film) {
            return responseHandler(req, res, 404, { message: "Invalid Film id provided.", data: null });
        }

        let totalCalRatings

        //calculate the avg ratings about the film on each submit
        if (film.reviews.length) {
            totalCalRatings = film.reviews.map(item => item.rating).reduce((a, c) => { return a + c });
            totalCalRatings = (totalCalRatings / film.reviews.length).toFixed(2);

            //Restrict user from multiple reviews against same film
            let checkAlreadyExists = film.reviews.filter((item) => {
                return item.filmId === data.filmId && item.userId === req.user.id;
            });

            if (checkAlreadyExists) {
                return responseHandler(req, res, 409, { message: "Rating Already Submitted", data: null });
            }
        } else {
            totalCalRatings = data.rating
        }

        //push review object to film reviews array
        let reviewObj = {}
        reviewObj.filmId = data.filmId
        reviewObj.reviewerId = req.user.id
        reviewObj.rating = data.rating

        await Film.findByIdAndUpdate({ _id: data.filmId }, { $push: { reviews: reviewObj }, $set: { avgRatings: totalCalRatings } }, { returnOriginal: false })
        usersLogger.info(`Status: 200 - "Review Added" - UserID: ${req.user.id} - filmId: ${data.filmId} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return responseHandler(req, res, 200, { message: "Review submitted successfully" });
    } catch (e) {
        errorLogger.error(`Status: 500 - "Internal Server Error" - UserID: ${req.user.id} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return responseHandler(req, res, 500, {
            message: "Internal Server Error", error: e?.message ?? e
        });
    }
}
