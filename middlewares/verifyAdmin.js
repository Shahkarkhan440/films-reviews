"use strict";

const { responseHandler } = require("../utilities/helper");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models/database")



module.exports.verifyAdmin = async (req, res, next) => {
    let reqToken = req.headers['token'];
    try {
        if (!reqToken) {
            return responseHandler(req, res, 400, { message: "invalid request to api." });
        } else {

            let decodedToken = jwt.verify(reqToken, process.env.JWT_SECRET)
            let admin = await Admin.findById(decodedToken.id).lean()
            if (!admin) {
                return responseHandler(req, res, 404, { message: "Admin is unauthorized" });
            }
            req.admin = { ...decodedToken, name: user.name, };
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



