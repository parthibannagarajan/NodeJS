var express    = require("express"),
    app        = express(),
    mongoose   = require("mongoose"),
    bodyParser = require("body-parser"),
    Campgrounds = require("./models/campground"),
    seed      = require("./seeds");
    // seed(); 

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/yelp_camp2", { useNewUrlParser: true });





app.get("/", function(req, res){
  res.render("landing");
});

// index route - show all campgrounds
app.get("/campgrounds", function(req, res){
  Campgrounds.find({}, function(err, allCampground){
    if (err){
      console.log("there is error");
      console.log(err); 
    } else {
      res.render("campground", {campgrounds: allCampground});
    }
  });
});


// create - add new campground to the DB
app.post("/campground", function(req, res){
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
    res.redirect("/campgrounds");      
  }
    });
  });

// new - show the form to create new campground
app.get("/campgrounds/new", function(req, res){
  res.render("new");
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
      res.render("show", {campground: foundcampground});
    }
  });
});

app.listen(7000, function(){
  console.log("yelpcamp 7000 server is running");
});