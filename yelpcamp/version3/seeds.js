var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [{title: "cloud rest",
  image: "https://images.unsplash.com/photo-1548407260-da850faa41e3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=887&q=80 887w",
  description: "blah blah blah" 
},{
  title: "politicien",
  image: "https://images.unsplash.com/photo-1548560781-a7a07d9d33db?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=281&q=80 281w",
  description: "tri tri" 
},{
  title: "rest",
  image: "https://images.unsplash.com/photo-1548561711-73eae96ad48d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2392&q=80 2392w",
  description: "blah dfg" 
}];

function seedDB(){
  // remove all campgrounds
Campground.remove({}, function(err){
  if(err){
    console.log(err);
  } 
  console.log("removed campgrounds");
});
// add a few campgrounds
  data.forEach(function(seed){
    Campground.create(seed, function(err, campground){
      if(err){
        console.log(err)
      } else {
        console.log("added a campground");
          // add comments
              Comment.create({
                text: "this place is great",
                author: "homer"
              }, function(err, comment){
                if(err){
                  console.log(err);
                } else {
                  campground.comments.push(comment);
                  campground.save();
                  console.log("created new comment");
                }
        });
      }
    });
  });
}

module.exports = seedDB;