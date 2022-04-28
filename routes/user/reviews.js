const express = require("express");
const router = express.Router();
const reviewsController = require("../../controllers/user/reviewsController");
const { verifyReviewer } = require("../../middlewares/verifyReviewer")

router.post(
    "/add-review",
    verifyReviewer,  //a middleware to check whether the user is a reviewer and is valid user
    reviewsController.addReview
);

module.exports = router;