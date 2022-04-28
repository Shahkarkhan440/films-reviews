const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyUser } = require("../middlewares/verifyUser");


router.post(
    "/signup",
    authController.signup
);


router.post(
    "/login",
    authController.login
);


module.exports = router;