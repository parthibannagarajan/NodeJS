var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

var campgrounds = [ {title: "Nature" , image:"https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350" },
  {title: "Secenary" , image:"https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350 " },
  {title: "Rose", image:"https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350" },
  {title: "Secenary" , image:"https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350 " },
  {title: "Secenary" , image:"https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350 " },
  {title: "Secenary" , image:"https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350 " },
  {title: "Secenary" , image:"https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350 " }];


app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  
  res.render("campground", {campgrounds: campgrounds});
});

app.post("/campground", function(req, res){
  //get data from form and save to the campgrounds array
  var title = req.body.title;
  var image = req.body.image;
  var newCamp =  {title : title, image: image}
  campgrounds.splice(0, 0, newCamp);
  // redirect to the campgrounds page
  res.redirect("/campgrounds");
});


app.get("/campgrounds/new", function(req, res){
  res.render("new");
});

app.listen(7000, function(){
  console.log("yelpcamp 7000 server is running");
});