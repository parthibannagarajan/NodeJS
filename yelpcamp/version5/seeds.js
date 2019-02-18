var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [{title: "cloud",
  image: "https://www.campsitephotos.com/photo/camp/60195/Lake_Success_View_1.jpg",
  description:"Lorem Ipsum is simply dummy text of the composition and layout before printing. Lorem Ipsum has been the standard text for printing since the 1500s, when an anonymous printer assembled pieces of text together to make a sample book of text fonts. It has not only survived five centuries, but has also adapted to computer office, without its content is changed. It was popularized in the 1960s through the sale of Letraset sheets containing passages from Lorem Ipsum, and, more recently, by its inclusion in text layout applications, such as Aldus PageMaker."
},{
  title: "mountain",
  image: "https://www.campsitephotos.com/photo/camp/18447/Silver_Lake_002.jpg",
  description: "Lorem Ipsum is simply dummy text of the composition and layout before printing. Lorem Ipsum has been the standard text for printing since the 1500s, when an anonymous printer assembled pieces of text together to make a sample book of text fonts. It has not only survived five centuries, but has also adapted to computer office, without its content is changed. It was popularized in the 1960s through the sale of Letraset sheets containing passages from Lorem Ipsum, and, more recently, by its inclusion in text layout applications, such as Aldus PageMaker." 
},{
  title: "water",
  image: "https://www.campsitephotos.com/photo/camp/26705/Hopeville_Pond_001.jpg",
  description: "Lorem Ipsum is simply dummy text of the composition and layout before printing. Lorem Ipsum has been the standard text for printing since the 1500s, when an anonymous printer assembled pieces of text together to make a sample book of text fonts. It has not only survived five centuries, but has also adapted to computer office, without its content is changed. It was popularized in the 1960s through the sale of Letraset sheets containing passages from Lorem Ipsum, and, more recently, by its inclusion in text layout applications, such as Aldus PageMaker." 
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