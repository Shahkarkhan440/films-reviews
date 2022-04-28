
const mongoose = require("mongoose");
require("dotenv").config();
const { userAccStatuses, filmStatuses } = require("../utilities/enum")


// connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING + process.env.DB_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var db = mongoose.connection;

// handle mongo error
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Database Connected");
});


//users schema
var userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        description: { type: String, default: null, blackbox: true },
        password: { type: String, required: true },
        IsReviewer: { type: Boolean, default: false },
        status: { type: String, default: "active", enum: Object.values(userAccStatuses) },
    },
    { timestamps: true }
);
module.exports.User = mongoose.model("users", userSchema);


//films schema
let FilmsSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    rating: { type: Number, required: true },
    review: { type: String, required: true },
    country: { type: String, required: true },
    genres: { type: Array, default: [] },
    photos: { type: String, required: true },
    reviwerId: { type: String, required: true },
    status: { type: String, default: "active", enum: Object.values(filmStatuses) },
},
    { timestamps: true });
module.exports.Film = mongoose.model("films", FilmsSchema)

//comments schema
let commentsSchema = mongoose.Schema({
    filmId: { type: String, required: true },
    comment: { type: String, required: true },
    userId: { type: String, required: true },
}, { timestamps: true })
module.exports.Comment = mongoose.model("comments", commentsSchema)









