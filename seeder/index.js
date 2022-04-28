const { Film, User, Comment, Admin } = require("../models/database")
const bcrypt = require("bcryptjs");

exports.seeder = async () => {

    let admin = await Admin.findOne({ email: "admin@gmail.com" }).lean()
    if (!admin) {
        let adminData = new Admin({
            name: "Admin",
            email: "admin@gmail.com",
            password: bcrypt.hashSync('Admin@123', 8),
        });
        await adminData.save()
    }

    let user = await User.findOne({ email: "user@dummyemail.com" }).lean()
    if (!user) {
        var userData = new User({
            name: "Dummy User 1",
            email: "user@dummyemail.com",
            description: "this is dummy user 1",
            password: bcrypt.hashSync('User@123', 8),
            isReviewer: false
        });
        await userData.save()
    }

    let checkFilms = await Film.find({}).lean()



    if (checkFilms.length == 0) {


        let films = await Film.insertMany(
            [
                {
                    "name": "Film A",
                    "description": "this is the description for film A",
                    "releaseDate": "2022-04-01T00:00:00.000+0000",
                    "country": "India",
                    "genres": ["action", "romantic"],
                    "photo": "film-a.jpg",
                    "reviews": [],
                },
                {
                    "name": "Film B",
                    "description": "this is the description for film B",
                    "releaseDate": "2022-05-01T00:00:00.000+0000",
                    "country": "Pakistan",
                    "genres": ["action", "romantic"],
                    "photo": "film-b.jpg",
                    "reviews": [],
                },
                {
                    "name": "Film C",
                    "description": "this is the description for film C",
                    "releaseDate": "2022-06-01T00:00:00.000+0000",
                    "country": "India",
                    "genres": ["history", "action", "political"],
                    "photo": "film-c.jpg",
                    "reviews": [],
                },
            ])

        films.length && films.forEach((item) => {
            Comment.create(
                {
                    filmId: item._id,
                    userId: userData._id,
                    comment: `This is dummy comment for ${item.name}`
                },
            )
        })

        console.log("Seeder Run successfully")

    } else {
        console.log("Data already exists in DB. Disbable Seeder() in app.js")
    }



}

