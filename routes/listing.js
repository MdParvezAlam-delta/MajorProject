const express = require ("express");
const router =  express.Router();
const wrapAsync = require ("../util/wrapAsync.js");


const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner,validateListing} = require ("../middleware.js");

const listingController = require ("../controllers/listing.js");

// Initializing & require it ---------------------------------------------------------------------------------------------------
const multer = require('multer');
// const upload = multer({dest: 'uploads/'});

// -----------------------------------------------------------------------------------------------------------------------------
// import storage for access cludinary----->
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


// -----------------------------------------------------------------------------------------------------------------------------

router
   .route("/")
  //  --->Index route
   .get(
    wrapAsync (listingController.index))
     // --->Create route
   .post(
     isLoggedIn,
    //  validateListing,
     upload.single("listing[image]"),
     validateListing,
    wrapAsync(listingController.create)
);
// .post( upload.single('listing[image]'),(req,res)=>{
//   res.send(req.file);
// }
// )
   
// --------------------------------------------------------------------------------------------------------------------


// New listing form-------------------------|
router.get("/new", isLoggedIn,
  listingController.new
);


// --------------------------------------------------------------------------------------------------------------------


router
.route("/:id")
 // --->Show route
.get( 
  wrapAsync(listingController.show)
)

 // --->Update route

.put(
  isLoggedIn,
  isOwner,
   upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.update)
)
 // --->Delete route

.delete( 
   isLoggedIn,
  isOwner,
  wrapAsync(listingController.delete)
);
// --------------------------------------------------------------------------------------------------------------------

// Edit Route - show edit form for a listing------------------|
router.get("/:id/edit", 
  isLoggedIn, 
  isOwner,
  wrapAsync(listingController.edit)
);




// --------------------------------------------------------------------------------------------------------------------
// Index Route - list all listings----------| 
// router.get("/",
//   wrapAsync (listingController.index));

// Show Route - show details for a listing----------------------------|
// router.get("/:id", 
//   wrapAsync(listingController.show)
// );

// Create Route - create a new listing with validation check for body------------------------|

// router.post("/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.create)
// );

// Update Route - update a listing----------------------------|
// router.put("/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(listingController.update)
// );

// Delete Route - delete a listing---------------------------|
// router.delete("/:id", 
//    isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.delete)
// );

// --------------------------------------------------------------------------------------------------------------------
module.exports = router;