var express    = require("express"),
    app        = express(),
    mongoose   = require("mongoose"),
    bodyParser = require("body-parser"),
    Campgrounds = require("./models/campground"),
    Comment     = require("./models/comment"),
    seed      = require("./seeds");
    
mongoose.connect("mongodb://localhost:27017/yelp_camp5", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
// seed(); 




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

  app.get("/campgrounds/:id/comments/new", function(req, res){  
 // find campground by id
 Campgrounds.findById(req.params.id, function(err, campground){
  if(err){
      console.log(err);
  } else {
       res.render("comments/new", {campground: campground});
  }
})});

app.post("/campgrounds/:id/comments", function(req, res){
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
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

app.listen(7000, function(){
  console.log("yelpcamp 7000 server is running");
});