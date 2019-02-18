var express               = require("express"),
    app                   = express(),
    mongoose              = require("mongoose"),
    bodyParser            = require("body-parser"),
    passport              = require("passport"),
    localStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User                  = require("./models/user"),
    Campgrounds           = require("./models/campground"),
    Comment               = require("./models/comment"),
    seed                  = require("./seeds");
    
mongoose.connect("mongodb://localhost:27017/yelp_camp7", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//seed the database
// seed(); 

//passport configuration

app.use(require("express-session")({
  secret: "celine is best always",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});




app.get("/", function(req, res){
  res.render("./campgrounds/landing");
});

// index route - show all campgrounds
app.get("/campgrounds", function(req, res){
  Campgrounds.find({}, function(err, allCampground){
    if (err){
      console.log("there is error");
      console.log(err); 
    } else {
      res.render("./campgrounds/campground", {campgrounds: allCampground});
    }
  });
});


// create - add new campground to the DB
app.post("/campgrounds", function(req, res){
  //get data from form and save to the campgrounds array
  var title = req.body.title;
  var image = req.body.image;
  var desc = req.body.description;
  var newCamp =  {title : title, image: image, description: desc}
  // create a new campground and save to DB
    Campgrounds.create(newCamp, function(err, newlyCreated){
      if (err){
        console.log("there is error");
        console.log(err); 
      } else {
    // redirect to the campgrounds page
    res.redirect("./campgrounds");      
  }
    });
  });

// new - show the form to create new campground
app.get("/campgrounds/new", function(req, res){
  res.render("./campgrounds/new");
});

// show - show info of campground  
app.get("/campgrounds/:id", function(req, res){
  // find the campground with provided ID
  Campgrounds.findById(req.params.id).populate("comments").exec(function(err, foundcampground){
    if(err){
      console.log(err);
    } else {
      console.log(foundcampground);
      // render show template with that campground
      res.render("./campgrounds/show", {campground: foundcampground});
    }
  });
});


// ====================================
// comments route
// ====================================

  app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){  
 // find campground by id
 Campgrounds.findById(req.params.id, function(err, campground){
  if(err){
      console.log(err);
  } else {
       res.render("comments/new", {campground: campground});
  }
})});

app.post("/campgrounds/:id/comments",isLoggedIn, function(req, res){
  //lookup campground using id
  Campgrounds.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          //add username and id to connect
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});


//Auth routes

// show register form
app.get("/register", function(req, res){
  res.render("register");
});

//handle the signUp logic post route
app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds")
    });
    // req.login(user, function(err) {
    //   if (err) {
    //     console.log(err);
    //     return next(err);
    //   }
    //   return res.redirect('/campgrounds');
    // });
  });
});

// show login form
app.get("/login", function(req, res){
  res.render("login");
});

//handling login logic post route
app.post("/login", passport.authenticate("local", 
{ successRedirect: "/campgrounds", 
  failureRedirect: "/login"
}), function(req, res){

});

//logout route

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
});


// middleware function

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}


app.listen(7000, function(){
  console.log("yelpcamp 7000 server is running");
});