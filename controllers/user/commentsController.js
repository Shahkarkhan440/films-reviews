
"use strict"

const { Validator } = require('node-input-validator');
const { responseHandler, } = require("../../utilities/helper");
const { Film, Comment } = require("../../models/database")

module.exports.addComment = async (req, res) => {
    try {

        const data = req.body;
        //validator class which validates incoming req data
        const validateReq = new Validator(data, {
            filmId: 'required|string',
            comment: 'required|string',
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

        const checkAlreadyExists = await Comment.findOne({ filmId: data.filmId, userId: req.user.id, comment: data.comment })
        if (checkAlreadyExists) {
            return responseHandler(req, res, 404, { message: "Same comment already added for this film id.", data: null });
        }
        let commentObj = new Comment({
            filmId: data.filmId,
            userId: req.user.id,
            comment: data.comment,
        })
        let saveObj = await commentObj.save()
        return responseHandler(req, res, 200, { message: "Comment Added successfully", saveObj });
    } catch (e) {
        console.log(e)
        return responseHandler(req, res, 500, {
            message: "Internal Server Error", error: e?.message ?? e
        });
    }
}