var mongoose = require("mongoose");
  mongoose.connect("mongodb://localhost: 27017/cat_app", { useNewUrlParser: true });

// schema setup
var catSchema = new mongoose.Schema({
  name: String,
  age: Number,
  temperament: String
});

//making the model
var Cat = mongoose.model("Cat", catSchema);

//adding a new cat to the DB

// var george = new Cat({
//   name: "george",
//   age: 7,
//   temperament: "wild"
// });

// george.save(function(err, cat){
//   if(err){
//     console.log("something went wrong");
//   } else {
//     console.log("we just saved a cat to the DB");
//     console.log(cat);
//   }
// });

Cat.create({
  name: "rusty",
  age: 7,
  temperament: "evil"
}, function(err, cat){
    if(err){
      console.log("something went wrong");
      console.log(err);
    } else {
      console.log("we just saved a cat to the DB");
      console.log(cat); }});

//retrieve all cats from the DB and console.log each one

Cat.find({}, function(err, cats){
  if (err) {
    console.log("oh no, error");
    console.log(err);
  } else {
    console.log("all the cats");
    console.log(cats);
  }
});
