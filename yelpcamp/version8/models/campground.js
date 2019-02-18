var mongoose = require("mongoose");


// schema setup

var campgroundSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String,
  author:{
    id: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

//making model of campgroundSchema


module.exports = mongoose.model("Campground", campgroundSchema);;