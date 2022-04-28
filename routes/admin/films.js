const express = require("express");
const router = express.Router();
const filmsController = require("../../controllers/admin/filmsController");
const { verifyAdmin } = require("../../middlewares/verifyAdmin");

const { imageTypes } = require("../../utilities/enum")


const multer = require('multer');

const upload = multer({

    dest: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    },
    fileFilter: (req, file, cb) => {
        if (!imageTypes.includes(file.mimetype)) {
            return cb(new Error("invalid image type uploaded"))
        }
        cb(null, true)
    },

});

const uploadMiddleware = (req, res, next) => {
    const m = upload.single('photo');

    // Here call the upload middleware of multer
    m(req, res, function (e) {
        if (e instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return responseHandler(req, res, 400, { message: "only one image is allowed", error: e?.message ?? e });
        } else if (e) {
            // An unknown error occurred when uploading.
            return responseHandler(req, res, 400, { message: e?.message ?? e, error: e?.message ?? e });
        }
        // Everything went fine.
        next()
    })
}


router.post(
    "/add-film",
    // verifyAdmin,
    uploadMiddleware,
    filmsController.addFilm
);

router.get(
    "/all-films",
    // verifyAdmin,
    filmsController.getAllFilms
);

router.post(
    "/view-film",
    // verifyAdmin,
    filmsController.viewFilm
);


router.put(
    "/update-film",
    // verifyAdmin,
    uploadMiddleware,
    filmsController.updateFilm
);

router.delete(
    "/delete-film",
    // verifyAdmin,
    filmsController.deleteFilm
);




module.exports = router;