var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blog_demo_2", { useNewUrlParser: true });

var Post = require("./models/post");
var User = require("./models/user");





// add the data

// User.create({ 
//   email:"msabille@gmail.com",
//   name:"Manuel Sabille"

//   },function(err, user){
//       if(err)
//           console.log(err);
//       else
//           console.log(user);

// });

// Post.create({ 
//   title:"porsche Cars",
//   content:"porsche car always return good value on invenstment"

//   },function(err, post){
//       if(err)
//           console.log(err);
//       else{
//           User.findOne({name:"Manuel Sabille"}, function(err, foundUser){
//              if(err) 
//                   console.log(err);
//               else {
//                    //console.log(foundUser);

//                     foundUser.posts.push(post);
//                     foundUser.save(function(err,data){
//                      if(err)
//                           console.log(err);
//                        else
//                               console.log(data);
               
//                       });
                      
//               }
//           });   
//       }    
//   });

// Find user
// find all posts for that user

User.findOne({email: "msabille@gmail.com"}).populate("posts").exec(function(err, user){
    if(err){
        console.log(err);
    } else {
        console.log(user);
    }
});

