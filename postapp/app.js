var express = require ("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var friendsList = ["céline", "parthi", "akli", "ammel"];

app.get("/", function(req, res){
  res.render("home");
});

app.post("/amis", function(req, res){
  var newfriend = req.body.addfriend;
  friendsList.push(newfriend);
  res.redirect("/friends");

});

app.get("/friends", function(req, res){
  res.render("friends", {friends: friendsList});
});



app.listen(2000, function () {
  console.log ("server 2000 is listening ");
});