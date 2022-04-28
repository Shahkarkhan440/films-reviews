"use strict";

const { responseHandler } = require("../utilities/helper");
const jwt = require("jsonwebtoken");
const { User } = require("../models/database")
const { userAccStatuses } = require("../utilities/enum")


module.exports.verifyUser = async (req, res, next) => {
    let reqToken = req.headers['token'];
    try {
        if (!reqToken) {
            return responseHandler(req, res, 400, { message: "invalid request to api." });
        } else {

            let decodedToken = jwt.verify(reqToken, process.env.JWT_SECRET)

            let user = await User.findById(decodedToken.id).lean()

            if (!user) {
                return responseHandler(req, res, 404, { message: "user is unauthorized" });
            }

            if (user.status === userAccStatuses.blocked) {
                return responseHandler(req, res, 403, {
                    message: "user account is blocked",
                });
            }

            req.user = { ...decodedToken, email: user.email, name: user.name, description: user.description ?? null };
            next()
        }
    } catch (e) {

        if (e.message.includes("invalid") || e.message.includes("malformed")) {
            return responseHandler(req, res, 401, { message: "Invalid Token provided" });
        }
        else if (e.message.includes("expired")) {
            return responseHandler(req, res, 401, { message: "Session got expired. please login again" });
        } else {
            return responseHandler(req, res, 500, { message: "Internal server error", error: e?.message ?? e });
        }

    }

}



