// requiring dotenv-----------------------------------------------------------------------------------------------
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
if (process.env.NODE_ENV != "production"){
require('dotenv').config();
}
// console.log(process.env.SECRET);

// --------------------------------------------------------------------------------------------------------------------
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require ("./util/wrapAsync.js");
const ExpressError = require ("./util/ExpressError.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL


const { listingSchema,reviewSchema} = require("./schema.js");
const Reviews = require("./models/review.js");

const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require ("passport-local");
const User = require("./models/user.js");
// -----------------------------------------------------------------------------------------------------------------
// requiring express router--------
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js"); 
const userRoute = require("./routes/user.js");

// --------------------------------------------------------------------------------------------------------


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// -----------------------------------------------------------------------------------------------------------------

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// this ejs-mate is used for includes & partials - we will use it as boilerplate.
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// -----------------------------------------------------------------------------------------------------------------
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});
// -----------------------------------------------------------------------------------------------------------------
const sessionOption = {
  secret: process.env.SECRET,
  store,
  resave: false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  }
}
// -----------------------------------------------------------------------------------------------------------------

// / Home route
// app.get("/", (req, res) => 
//   res.send("Hi,this is your home route")
// );

// -----------------------------------------------------------------------------------------------------------------

app.use(session(sessionOption));  // using sessions
app.use(flash()); // using flash

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --------flash middleware defined ----------|
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
// -----------------------------------------------------------------------------------------------------------------
// create a userId -------------------------|

// app.get("/demouser", async(req, res)=>{
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username:"delta-student",
//   });

//   let registeredUser = await  User.register(fakeUser, "helloworld");
//   res.send(registeredUser);`
// });

// -----------------------------------------------------------------------------------------------------------------

// creating joi schema validation middleware for listings-----------------

// creating joi schema validation middleware for reviews------------

// --------------------------------------------------------------------------------------------------------
// using express router-----------------------
app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewRoute );
app.use("/", userRoute );

app.get("/", (req, res) => {
  res.redirect("/listings");
});
// --------------------------------------------------------------------------------------------------------

// Index Route - list all listings

// New listing form

// Show Route - show details for a listing

// Create Route - create a new listing with validation check for body

// Edit Route - show edit form for a listing

// Update Route - update a listing

// Delete Route - delete a listing

// REVIEWS
// Post Route


// DELETE REVIEW POST---------------------------------------------->
// -----------------------------------------------------------------------------------------------------------------

// Catch-all for unknown routes - triggers 404 error
app.all('/*splat', (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'));
});

// Updated Error handling middleware - handles Mongoose validation errors nicely
app.use((err, req, res, next) => {
  let {statusCode = 500 , message = "something id wrong!"} = err;

  res.status(statusCode).render("error.ejs", {message});
});


// Start the server
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
// -----------------------------------------------------------------------------------------------------------------
