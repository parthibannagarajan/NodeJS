var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blog_demo", { useNewUrlParser: true });


//POST - title, content

var postSchema = new mongoose.Schema({
  title: String,
  content: String
});

var Post = mongoose.model("Post", postSchema);


// USER schema - email and name

var userSchema = new mongoose.Schema({
  email: String,
  name: String,
  posts: [postSchema]
});

var User = mongoose.model("User", userSchema);

// // add data to the schema

User.create({
  email: "hermione@hogwarts.edu",
  name: "Hermione Granger",
  posts: []
}, function (err, user) {
  if (err) {
    console.log(err);
  } else {
    user.posts.push({
      title: "3 Things I really hate",
      content: "Voldemort.  Voldemort. Voldemort"
    });
    user.save(function (err, user) {
      if (err) {
        console.log(err);
      } else {
        console.log(user);
      }
    });
  }
});

// var newUser = new User({
//   email: "bowl@gmail.com",
//   name: "steyn"
// });

// newUser.posts.push({
//   title: "helo helo",
//   content: "i am kidding"
// });

// newUser.save(function(err, user){
//   if(err){
//     console.log(err);
//   } else {
//     console.log(user);
//   }
// });

User.findOne({name: "Hermione Granger"}, function(err, user){
  if(err){
    console.log(err);
    
  } else {
    console.log(user);
    
  }
});

// User.create({
//   email: "hermione@hogwarts.edu",
//   name: "Hermione Granger",
//   posts: [
//     {
//       title: "Reflections on Apples",
//       content: "They are delicious"
//     }
//   ]
// }, function (err, user) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(user);
//   }
// });