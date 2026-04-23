const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');         // mapbox realted code 
const mbxClient = require("@mapbox/mapbox-sdk");
const mapboxClient = mbxClient({ accessToken: process.env.MAP_TOKEN });
const geocodingClient = mbxGeocoding(mapboxClient);

// <-------index route---------------------------------------------------------------------------------->
// Without the Search Functionalities :-------

// module.exports.index=async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
// };




// With the search functionalities:-------




module.exports.index = async (req, res) => {
  const { q, category } = req.query;

  let allListings;

  // -------------------- filterization code --------------------
  // filtering listings by selected category
  if (category && category.trim() !== "") {
    allListings = await Listing.find({ categories: category });
  } else if (q && q.trim() !== "") {
    allListings = await Listing.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } },
      ],
    });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listings/index.ejs", { allListings, q, category });
};




// <-------new route---------------------------------------------------------------------------------->

module.exports.new =  (req, res) => {
  res.render("listings/new.ejs");
};


// <-------show route---------------------------------------------------------------------------------->

module.exports.show=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
  
.populate({
    path: "reviews",
    populate: {
        path: "author",
    }
})
    .populate("owner");
    if(!listing){
    req.flash("error" , "Requested listings isn't exist!");
    res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  };

  // <-------create route---------------------------------------------------------------------------------->

  module.exports.create=async (req, res, next) => {
    
    // mapbox code

    let response = await geocodingClient.forwardGeocode
    ({
    query: req.body.listing.location,
    limit: 1
    })
  .send()

    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url ,"..", filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image= {url , filename};
    newListing.geometry = response.body.features[0].geometry                                           // Mapbox realted code
    let saveListing = await newListing.save();                                                        // This will trigger Mongoose validation
    console.log(saveListing);

    req.flash("success" , "new listing Created !");
    res.redirect("/listings");
  };


    // <-------Edit route---------------------------------------------------------------------------------->

  module.exports.edit=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

     if(!listing){
    req.flash("error" , "Requested listings isn't exist!");
    res.redirect("/listings");
    }

    let currImg = listing.image.url;
    currImg = currImg.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, currImg });
  };



// <-------update route---------------------------------------------------------------------------------->

  module.exports.update=async (req, res) => {
    let { id } = req.params;

   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

// MapBox code

   if(typeof req.file !== "undefined")
    {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
   }

    req.flash("success" , "new listing updated !");
    res.redirect(`/listings/${id}`);
  };

  // <-------delete route---------------------------------------------------------------------------------->
module.exports.delete=async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
     req.flash("success" , "new listing Deleted !");
    res.redirect("/listings");
  };