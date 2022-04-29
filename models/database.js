
const mongoose = require("mongoose");
require("dotenv").config();
const { userAccStatuses, filmStatuses, allowedRatings } = require("../utilities/enum")

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB_CONNECTION_STRING
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    console.log("DB Connected")
});


//users schema
var userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        description: { type: String, default: null, blackbox: true },
        password: { type: String, required: true },
        isReviewer: { type: Boolean, default: false },
        status: { type: String, default: "active", enum: Object.values(userAccStatuses) },
    },
    { timestamps: true }
);
module.exports.User = mongoose.model("users", userSchema);



//Admin schema to use admin account for films crud.
var adminSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        status: { type: String, default: "active", enum: Object.values(userAccStatuses) },
    },
    { timestamps: true }
);
module.exports.Admin = mongoose.model("admin", adminSchema);


//sub schema for film reviews
let reviewsSchema = mongoose.Schema({
    reviewerId: { type: String, required: true },
    rating: {
        type: Number, required: true
    },
})

//films schema. the structure is a bit changed based on the scenario in film-reviews management system
let FilmsSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    avgRatings: { type: Number, default: 0 },
    country: { type: String, required: true },
    genres: { type: Array, default: [] },
    photo: { type: String, required: true },
    reviews: { type: [reviewsSchema], default: [] },
    status: { type: String, default: "active", enum: Object.values(filmStatuses) },
},
    { timestamps: true });
module.exports.Film = mongoose.model("films", FilmsSchema)

//comments schema. This schema can be more optimize if we dont follow the docx file completely
let commentsSchema = mongoose.Schema({
    filmId: { type: String, required: true },
    userId: { type: String, required: true },
    comment: { type: String, required: true },
}, { timestamps: true })
module.exports.Comment = mongoose.model("comments", commentsSchema)









