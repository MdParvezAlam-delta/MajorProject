const Listing = require("../models/listing");
const Reviews= require("../models/review");

module.exports.review=async (req, res)=>{
  let listing = await Listing.findById(req.params.id);
  let newReview = new Reviews(req.body.review);

  newReview.author = req.user._id;
  
  listing.reviews.push(newReview);
  await newReview.save();
  await  listing.save();

  console.log("new review saved");
  req.flash("success" , "new review created !");
  res.redirect(`/listings/${listing._id}`);

};

module.exports.delete=async(req,res)=>{
    let{id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success" , "review deleted !");
    res.redirect(`/listings/${id}`);
  };
  