"use strict";

const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const ip = require("ip");
const path = require("path");
require("dotenv").config();
const authRoutes = require("./routes/auth")
const { seeder } = require("./seeder/index")

const filmRoutes = require("./routes/admin/films")
const commentsRoutes = require("./routes/user/comments")
const reviewRoutes = require("./routes/user/reviews")

var app = express();
app.use(express.json());


app.use(cors());
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(mongoSanitize());
app.use(express.static(path.join(__dirname, "public")));


// auth routes

app.use(
    "/auth",
    authRoutes
)

app.use("/admin",
    filmRoutes
)


app.use("/user",
    commentsRoutes,
    reviewRoutes
)



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404);
    if (req.accepts("json")) {
        res.status(404).send({ message: "API URL not found" });
        return;
    }
});

// Server Running and Port listening
// const port = process.env.PORT || 3001;
// const host = process.env.NODE_ENV === 'dev' ? '0.0.0.0' : ip.address();
// const host = ip.address();

seeder()


// app.listen(port, host, () => {
//     console.log(`Server is runing on http://${host}:${port} - ${ip.address()}`);
// });


module.exports = app;
