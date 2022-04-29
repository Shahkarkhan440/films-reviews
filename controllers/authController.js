
"use strict"

const { Validator } = require('node-input-validator');
const { responseHandler, passwordStrengthChecker, } = require("../utilities/helper");
const { User } = require("../models/database")
const bcrypt = require("bcryptjs");
const { userAccStatuses } = require("../utilities/enum")
const jwt = require("../utilities/jwtToken");
const { authLogger, errorLogger } = require("../utilities/logger")



module.exports.signup = async (req, res) => {
    try {
        const data = req.body;
        const validateReq = new Validator(data, {
            name: 'required|string|maxLength:32',
            email: 'required|email',
            description: 'required|string|maxLength:100',
            password: 'required|string',
            isReviewer: 'required|string|in:true,false'
        });

        const matched = await validateReq.check();
        if (!matched) {
            return responseHandler(req, res, 400, {
                message: "Please fill all the required fields.", validationError: validateReq.errors
            });
        }

        if (!passwordStrengthChecker(data.password)) {
            return responseHandler(req, res, 406, {
                message: "This is not valid password format.(Required:Min 8, Max 32, Alpha Numeric with 1 Special Character)", validationError: {
                    password: {
                        "message": "This is not valid password format.(Required:Min 8, Max 32, Alpha Numeric with 1 Special Character)",
                        "rule": "passwordFormat"
                    }
                }
            });
        }

        let checkUsr = await User.findOne({ email: data.email }).lean();
        if (checkUsr) {
            return responseHandler(req, res, 400, {
                message: "Sorry, user with this email is already exists", validationError: {
                    email: {
                        "message": "Sorry, user with this email is already exists",
                        "rule": "emailExists"
                    }
                }
            });
        }
        // user save object
        let user = new User({
            name: data.name,
            email: data.email,
            description: data.description,
            password: bcrypt.hashSync(data.password, 8),
            isReviewer: data.isReviewer,
        });
        await user.save();
        authLogger.info(`Status: 200 - "Account created" - ${req.body.email} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        return responseHandler(req, res, 200, { message: "Account has been created successfully" });
    } catch (e) {
        errorLogger.error(`Status: 500 - "Internal Server Error" - ${req.body.email} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        return responseHandler(req, res, 500, {
            message: "Internal Server Error", error: e?.message ?? e
        });
    }
}


//login function

module.exports.login = async (req, res) => {
    try {
        const data = req.body;
        const validateReq = new Validator(data, {
            email: 'required|email',
            password: 'required|string',
        });
        const matched = await validateReq.check();
        if (!matched) {
            return responseHandler(req, res, 400, {
                message: "Please fill all the required fields.", validationError: validateReq.errors
            });
        }

        let validUser = await User.findOne({ email: data.email }).lean();

        if (!validUser) {
            return responseHandler(req, res, 404, {
                message: "No Account is associated with this email", validationError: {
                    email: {
                        "message": "No Account is associated with this email",
                        "rule": "notExists"
                    }
                }
            });
        }

        if (validUser.status === userAccStatuses.blocked) {

            authLogger.info(`Status: 403 - "Block user Accessing" - ${req.body.email} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

            return responseHandler(req, res, 403, {
                message: "user account is blocked", validationError: {
                    email: {
                        "message": "user account is blocked",
                        "rule": "Blocked"
                    }
                }
            });
        }

        let passIsValid = await bcrypt.compare(data.password, validUser.password)

        if (!passIsValid) {

            return responseHandler(req, res, 400, {

                message: "incorrect password entered", validationError: {
                    password: {
                        "message": "incorrect password entered",
                        "rule": "passwordIncorrect"
                    }
                }
            });
        } else {
            authLogger.info(`Status: 200 - "Account Login" - ${req.body.email} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return responseHandler(req, res, 200, {
                message: "login successfully",
                token: jwt.generateUserToken(validUser._id).accessToken,
                user: {
                    name: validUser.name,
                    email: validUser.email,
                    description: validUser.description ?? null
                }
            });
        }
    } catch (e) {
        errorLogger.error(`Status: 500 - "Internal Server Error" - ${req.body.email} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return responseHandler(req, res, 500, { message: "Internal Server Error", error: e?.message ?? e });
    }
}
