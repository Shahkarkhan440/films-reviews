
"use strict"

const { Validator } = require('node-input-validator');
const { responseHandler, deleteAllFiles } = require("../../utilities/helper");
const { Film } = require("../../models/database")
const { isEmpty } = require("lodash");
const ObjectId = require('mongoose').Types.ObjectId;



module.exports.addFilm = async (req, res) => {
    try {

        const data = req.body;

        const file = req.file

        if (!file) {
            return responseHandler(req, res, 400, {
                message: "Film photo is required."
            }, null, () => deleteAllFiles(file?.path));
        }

        console.log(file)

        const validateReq = new Validator(data, {
            name: 'required|string|maxLength:32',
            description: 'required|string|maxLength:100',
            releaseDate: 'required|string',
            country: 'required|string|maxLength:100',
        });

        const matched = await validateReq.check();
        if (!matched) {
            return responseHandler(req, res, 400, {
                message: "Please fill all the required fields.", validationError: validateReq.errors
            }, null, () => deleteAllFiles(file?.path));
        }

        if (isEmpty(data)) {
            return responseHandler(res, 400, {
                success: false,
                message: "Invalid request"
            }, null, () => deleteAllFiles(file?.path));
        }


        if (isEmpty(data?.genres)) {
            return responseHandler(req, res, 406, {
                message: "At least one genre must be entered", validationError: {
                    genre: {
                        "message": "At least one genre must be entered",
                        "rule": "oneElemetRequired"
                    }
                }
            }, null, () => deleteAllFiles(file?.path));
        }

        const film = await Film.findOne({ name: { $regex: data.name, $options: 'i' } });
        if (film) {
            return responseHandler(req, res, 409, { message: "Film already exists with this name" }, null, () => deleteAllFiles(file?.path));
        }

        let filmObj = new Film(

            {
                name: data.name,
                description: data.description,
                country: data.country,
                genres: data.genres,
                releaseDate: new Date(data.releaseDate),
                photo: file.filename,
            }
        );
        let saveObj = await filmObj.save();
        return responseHandler(req, res, 200, { message: "Film Added successfully", saveObj });
    } catch (e) {
        console.error(e)
        return responseHandler(req, res, 500, {
            message: "Internal Server Error", error: e?.message ?? e
        });
    }
}


module.exports.getAllFilms = async (req, res) => {
    try {
        const films = await Film.find({}).lean()
        if (films.length == 0) {
            return responseHandler(req, res, 404, { message: "No films were found", data: null });
        }
        return responseHandler(req, res, 200, { message: "All films are fetched successfully", films });
    } catch (e) {
        return responseHandler(req, res, 500, {
            message: "Internal Server Error", error: e?.message ?? e
        });
    }
}

module.exports.viewFilm = async (req, res) => {
    try {
        const data = req.body;
        const validateReq = new Validator(data, {
            filmId: 'required',
        });

        const matched = await validateReq.check();
        if (!matched) {
            return responseHandler(req, res, 400, {
                message: "Please fill all the required fields.", validationError: validateReq.errors
            });
        }

        if (!ObjectId.isValid(data.filmId)) {
            return responseHandler(req, res, 406, {
                message: "Invalid Film id provided."
            });
        }

        const film = await Film.findById(data.filmId).lean()
        if (!film) {
            return responseHandler(req, res, 404, { message: "Invalid Film id provided.", data: null });
        }
        return responseHandler(req, res, 200, { message: "Film details fetched successfully", film });
    } catch (e) {
        return responseHandler(req, res, 500, {
            message: "Internal Server Error", error: e?.message ?? e
        });
    }
}


module.exports.updateFilm = async (req, res) => {
    try {
        const data = req.body;
        const file = req.file

        if (!file) {
            return responseHandler(req, res, 400, {
                message: "Film photo is required."
            }, null, () => deleteAllFiles(file?.path));
        }
        const validateReq = new Validator(data, {
            filmId: 'required|string',
            name: 'required|string|maxLength:32',
            description: 'required|string|maxLength:100',
            releaseDate: 'required|string',
            country: 'required|string|maxLength:100',
        });

        const matched = await validateReq.check();
        if (!matched) {
            return responseHandler(req, res, 400, {
                message: "Please fill all the required fields.", validationError: validateReq.errors
            }, null, () => deleteAllFiles(file?.path));
        }

        if (isEmpty(data)) {
            return responseHandler(res, 400, {
                message: "Invalid request"
            }, null, () => deleteAllFiles(file?.path));
        }

        if (isEmpty(data?.genres)) {
            return responseHandler(req, res, 406, {
                message: "At least one genre must be entered", validationError: {
                    genre: {
                        "message": "At least one genre must be entered",
                        "rule": "oneElemetRequired"
                    }
                }
            }, null, () => deleteAllFiles(file?.path));
        }

        if (!ObjectId.isValid(data.filmId)) {
            return responseHandler(req, res, 406, {
                message: "Invalid Film id provided."
            }, null, () => deleteAllFiles(file?.path));
        }

        if (data.name) {
            const film = await Film.findOne({ name: { $regex: data.name }, _id: { $ne: data.filmId } });
            if (film) {
                return responseHandler(req, res, 409, { message: "Film already exists with this name" }, null, () => deleteAllFiles(file?.path));
            }
        }

        let result = { ...data, photo: file.filename }
        const film = await Film.findOneAndUpdate({ _id: data.filmId }, { $set: result }, { returnOriginal: false });
        if (!film) {
            return responseHandler(req, res, 409, { message: "Invalid Film Id" }, null, () => deleteAllFiles(file?.path));
        }
        return responseHandler(req, res, 200, { message: "Film Updated successfully", film });
    } catch (e) {
        console.error(e)
        return responseHandler(req, res, 500, {
            message: "Internal Server Error", error: e?.message ?? e
        });
    }
}


module.exports.deleteFilm = async (req, res) => {
    try {
        const data = req.body;
        const validateReq = new Validator(data, {
            filmId: 'required',
        });

        const matched = await validateReq.check();
        if (!matched) {
            return responseHandler(req, res, 400, {
                message: "Please fill all the required fields.", validationError: validateReq.errors
            });
        }
        if (!ObjectId.isValid(data.filmId)) {
            return responseHandler(req, res, 406, {
                message: "Invalid Film id provided."
            });
        }

        const film = await Film.deleteOne({ _id: data.filmId })
        if (film.deletedCount > 0) {
            return responseHandler(req, res, 200, { message: "Film deleted successfully", film });
        } else {
            return responseHandler(req, res, 404, {
                message: "No any film was found with id", data: null
            });
        }
    } catch (e) {
        return responseHandler(req, res, 500, {
            message: "Internal Server Error", error: e?.message ?? e
        });
    }
}