const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Campgrounds = require("../controllers/campground");
const catchAsync = require("../utils/catchAsync");
const { CampgroundSchema } = require("../schemas");
const { isLoggedIn } = require("../middleware");
const ExpressError = require("../utils/ExpressError");
const multer = require("multer");
const { validateCampground } = require("../middleware");
const { isAuthor } = require("../middleware");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });
// const upload = multer({ storage: storage });
router
  .route("/")
  .get(catchAsync(Campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(Campgrounds.createcampgrounds)
  );

router.get("/new", isLoggedIn, Campgrounds.rendernewform);

// router.post("/", isLoggedIn, validateCampground, catchAsync(Campgrounds.createcampgrounds));
// router.post("/",upload.single('image'),(req, res) => {
//   console.log(req.file)
//   // res.status(status).send(body);
// })
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(Campgrounds.renderEditform)
);

router.get("/:id", isLoggedIn, catchAsync(Campgrounds.showCampground));

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  upload.array("image"),
  validateCampground,
  catchAsync(Campgrounds.updateCampground)
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(Campgrounds.deleteCampground)
);

module.exports = router;
