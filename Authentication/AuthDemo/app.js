var express               = require("express"),
    app                   = express();
    mongoose              = require("mongoose"),
    User                  = require("./models/user"),
    bodyParser            = require("body-parser"),
    passport              = require("passport"),
    localStrategy         = require ("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost:27017/auth_demo_app", { useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
  secret: "céline is the best girl ",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ROUTES

app.get("/", function(req, res){
  res.render("home");
});

app.get("/secret",isLoggedIn, function(req, res){
  res.render("secret");
});

// Auth routes

// show sign up form

app.get("/register", function(req, res){
  res.render("register");
});

// handling user sign up

app.post("/register", function(req, res){
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.render('register');
      }
      passport.authenticate("local")(req, res, function(){
         res.redirect("/secret");
      });
  });
});

// Login routes

//render login form
app.get("/login", function(req, res){
  res.render("login");
});

//login routes
// middleware
  app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
  }) , function(req, res){

  });


  //logout routes

  app.get("/logout", function(req, res){

      req.logout();
      res.redirect("/");
  });

  // middleware function for logout 

  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
  }


app.listen(5000, function(){
  console.log("authentication 5000 server  is running");
});