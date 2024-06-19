const express = require('express');
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../schemas");
const { isLoggedIn } = require("../middleware");
const {isreviewuser}=require("../middleware")
const Campground = require("../models/campground");
const Reviews = require("../controllers/reviews");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const {validateReview}=require("../middleware")
router.post("/", isLoggedIn, validateReview, catchAsync(Reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isreviewuser, catchAsync(Reviews.deleteReview));

module.exports=router