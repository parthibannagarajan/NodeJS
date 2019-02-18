var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [{title: "cloud",
  image: "https://www.campsitephotos.com/photo/camp/60195/Lake_Success_View_1.jpg",
  description: "blah blah blah" 
},{
  title: "mountain",
  image: "https://www.campsitephotos.com/photo/camp/18447/Silver_Lake_002.jpg",
  description: "tri tri" 
},{
  title: "water",
  image: "https://www.campsitephotos.com/photo/camp/26705/Hopeville_Pond_001.jpg",
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