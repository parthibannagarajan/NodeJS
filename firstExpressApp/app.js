var express = require ("express");
var app = express();

app.get ("/", function(req, res){
  res.send("hi there");
});

app.get ("/dogs", function(req, res){
  res.send("hi puppy");
});

app.get ("/r/:name", function(req, res){
  var name = req.params.name;
  res.send("welcome to the " + name.toUpperCase() + " house");
});

app.get ("*", function(req, res){
  res.send("404 page not found");
});

var port = 1000;
app.listen(port, function () {
    console.log("The YelpCamp Server Has Started!");
});