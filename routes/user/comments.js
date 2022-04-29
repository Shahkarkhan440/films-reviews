const express = require("express");
const router = express.Router();
const commentsController = require("../../controllers/user/commentsController");
const { verifyUser } = require("../../middlewares/verifyUser")
const { isValidObjectId } = require("../../middlewares/isValidObjectId")

router.post(
    "/add-comment",
    // verifyAdmin,
    verifyUser,    //verify user that has valid token 
    isValidObjectId, //check whether object id format is valid or not
    commentsController.addComment
);


module.exports = router;