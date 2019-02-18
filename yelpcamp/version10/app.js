var express               = require("express"),
    app                   = express(),
    mongoose              = require("mongoose"),
    bodyParser            = require("body-parser"),
    methodOverride        = require("method-override"),
    passport              = require("passport"),
    localStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    flash                 = require ("connect-flash"),
    User                  = require("./models/user"),
    Campgrounds           = require("./models/campground"),
    Comment               = require("./models/comment"),
    seed                  = require("./seeds");
    
mongoose.connect("mongodb://localhost:27017/yelp_camp9", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
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
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
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
app.post("/campgrounds", isLoggedIn, function(req, res){
  //get data from form and save to the campgrounds array
  var title = req.body.title;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCamp =  {title : title, price : price, image: image, description: desc, author: author}
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
app.get("/campgrounds/new", isLoggedIn, function(req, res){
  res.render("./campgrounds/new");
});

// show - show info of campground  
app.get("/campgrounds/:id", function(req, res){
  // find the campground with provided ID
  Campgrounds.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err || !foundCampground){
      req.flash("error", "campground not found");
      res.redirect("/back");
      console.log(err);
    } else {
      console.log(foundCampground);
      // render show template with that campground
      res.render("./campgrounds/show", {campground: foundCampground});
    }
  });
});



//============///
// edit route
app.get("/campgrounds/:id/edit", checkCampgroundOwnership, function(req, res){
         
        Campgrounds.findById(req.params.id, function(err, foundCampground){
          res.render("./campgrounds/edit", {campground: foundCampground});
        });        
});

//update route
app.put("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
  //find and update the correct the campground
  Campgrounds.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
   });
});

// destroy route for campground
app.delete("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
  Campgrounds.findByIdAndRemove(req.params.id, function(err){
     if (err) {
       res.redirect("/campgrounds");
  } else {
    res.redirect("/campgrounds");
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
          req.flash("error", "something went wrong")
          console.log(err);
        } else {
          //add username and id to connect
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "successfully added comment");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

//============//

// edit routes for comment
app.get("/campgrounds/:id/comments/:comment_id/edit",checkCommentsOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.redirect("back");
    } else {
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
  });
  
});

//update routes for the comment 

app.put("/campgrounds/:id/comments/:comment_id", checkCommentsOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// destroy routes for the comment
  app.delete("/campgrounds/:id/comments/:comment_id", checkCommentsOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){
        res.redirect("back");
      } else {
        req.flash("success", "deleted successfully");
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
  });


// =================
    //Auth routes
//==================

// show register form
app.get("/register", function(req, res){
  res.render("register");
});

//handle the signUp logic post route
app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      // req.flash("error", err.message);
      // return res.render("register");
      return res.render("register", {"error": err.message});
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to the yelpcamp" + user.username);
      res.redirect("/campgrounds")
    });
    
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
  req.flash("success", "logged you out");
  res.redirect("/campgrounds");
});


// middleware function for logged in

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "please login first");
  res.redirect("/login");
}

//middleware function for check ownership for campgrounds

function checkCampgroundOwnership(req, res, next){
  // is user logged in ?
  if(req.isAuthenticated()){        
           Campgrounds.findById(req.params.id, function(err, foundCampground){
                 if(err || !foundCampground){
                        req.flash("error", "Campground not found");
                          res.redirect("back");  
                          } else {
                           // does the user own the campground?
                         if(foundCampground.author.id.equals(req.user._id)){
                                                     next();
                                } else {
                                  req.flash("error", "permission denied");

                                 res.redirect("back");
                                  }     
                               }
                             });
                   } else {
 // "back" is the method that will take the user to where they came from
          req.flash("error", "please login first");
            
          res.redirect("back");
}}

//middleware function for check ownership for comments

function checkCommentsOwnership(req, res, next){
  // is user logged in ?
  if(req.isAuthenticated()){        
           Comment.findById(req.params.comment_id, function(err, foundComment){
                 if(err){
                          res.redirect("back");  
                          } else {
                           // does the user own the comment?
                         if(foundComment.author.id.equals(req.user._id)){
                                                     next();
                                } else {
                                  req.flash("error", "something went wrong");  
                                 res.redirect("back");
                                  }     
                               }
                             });
                   } else {
 // "back" is the method that will take the user to where they came from
 req.flash("error", "you dont have permission to do that");  
 res.redirect("back");
}}

app.listen(7000, function(){
  console.log("yelpcamp 7000 server is running");
});