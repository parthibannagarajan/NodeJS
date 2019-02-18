var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function(req, res){
  res.render("first");
});

app.get("/hi/:things", function(req, res){
var thing = req.params.things;
  res.render("second", {thingVar: thing});
});

app.get("/posts", function(req, res){
var post = [
  {title: "NodeJS", author: "parthi"},
  {title: "PHP", author: "céline"},
  {title: "Java", author: "philip"}
];

  res.render("posts", {posts : post});
});


app.listen(1000, function () {
  console.log("server is running");
  
});