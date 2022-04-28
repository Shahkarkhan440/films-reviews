var jwt = require("jsonwebtoken");

// generating token
module.exports.generateUserToken = (userID) => {

    let accessToken = jwt.sign({ id: userID }, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "2h",
        // expiresIn: "1d",
    });

    let refreshToken = jwt.sign({ id: userID }, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "2h",
    });
    return { accessToken, refreshToken };
};


