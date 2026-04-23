const express = require ("express");
const router =  express.Router({mergeParams:true});
const wrapAsync = require ("../util/wrapAsync.js");
const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");
const {validatereview, isLoggedIn , isReviewAuthor} = require ("../middleware.js");

const reviewController = require ("../controllers/review.js");

// post review route

router.post("/", 
  isLoggedIn,
  validatereview ,
  wrapAsync (reviewController.review)
);

// DELETE REVIEW POST---------------------------------------------->

router.delete(
  "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
  wrapAsync(reviewController.delete)
);

module.exports = router;