const User    = require("../models/user.js");


// render signup----------------------------------------------------------->
module.exports.rendersignup = (req,res)=>{
    res.render("users/signup.ejs");
};

// render login----------------------------------------------------------->

module.exports.renderlogin=(req,res)=>{
    res.render("users/login.ejs");
};


// signup----------------------------------------------------------->

module.exports.signup=async (req, res) => {
        try {
            let { username, email, password } = req.body;
            const newUser = new User({ email, username });
            const registeredUser = await User.register(newUser, password);
            console.log(registeredUser);
     req.login(registeredUser, (err) => {
    if(err) {
        return next(err);
    }
    req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listings");
    });
    
} catch (e) {
            req.flash("error", e.message);
            res.redirect("/signup");
        }
    };

    // login----------------------------------------------------------->

        module.exports.login =async(req, res) => {
        req.flash("success", "welcome back to wanderlust")
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    };

     // logout----------------------------------------------------------->

     module.exports.logout= module.exports.logout=(req, res, next) => {
  req.logout((err) => {
    if(err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
};