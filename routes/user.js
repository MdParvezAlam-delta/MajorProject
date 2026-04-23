const express = require ("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require ("../controllers/user.js");

// --------------------------------------------------------------------------------------------------------------------

router
.route("/signup")
// render-signup---->
.get(  
    userController.rendersignup
)
// signup------>
.post(
    wrapAsync(userController.signup)
);

// --------------------------------------------------------------------------------------------------------------------

router
.route("/login")
// render-login--->
.get(
    userController.renderlogin
)
// login---->
.post(
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    userController.login
);

// --------------------------------------------------------------------------------------------------------------------
// logout----->

router.get("/logout", 
userController.logout
);


// --------------------------------------------------------------------------------------------------------------------

// render-signup---->
// router.get("/signup"  , 
//     userController.rendersignup
// );

// signup------>

// router.post(
//     "/signup",
//     wrapAsync(userController.signup)
// );

// render-login--->

// router.get("/login",
//     userController.renderlogin
// );

// login---->

// router.post(
//     "/login",
//     saveRedirectUrl,
//     passport.authenticate("local", {
//         failureRedirect: "/login",
//         failureFlash: true,
//     }),
//     userController.login
// );
// --------------------------------------------------------------------------------------------------------------------



module.exports = router;