var bodyParser         = require("body-parser"),
      mongoose         = require("mongoose"),
      express          = require("express"),
      methodOverride   = require("method-override"),
      expressSanitizer = require("express-sanitizer");
      app              = express();
// APP config      
mongoose.connect("mongodb://localhost: 27017/restfulBlog_app", { useNewUrlParser: true });
mongoose.set("useFindAndModify", false);
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static("public"));

//schema setup

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "bmw",
//   image: "https://invinciblengo.org/photos/event/slider/manali-girls-special-adventure-camp-himachal-pradesh-1xJtgtx-1440x810.jpg",
//   body: "camp sites number one"
// });

// RESTful Routes

// index blog "GET"
app.get("/", function(req, res){
  res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
  Blog.find({}, function(err, allBlogs){
    if(err){
      console.log(err);
    } else {
      res.render("index", {blogs: allBlogs});

    }
  });
});

//New route 

app.get("/blogs/new", function(req, res){
  res.render("new");
});

//create route

app.post("/blogs", function(req, res){
  //create blogs
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newBlog){
    if(err){
      console.log(err);
    } else{
      //redirect to blogs
      res.redirect("/blogs");
    }
  });
  
});

//Show route

app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("show", {blog: foundBlog});
    }
  })
});

//Edit route

app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  })
});

//update route

app.put("/blogs/:id", function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body); 
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });

});

// Delete route

app.delete("/blogs/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});


app.listen(9000, function(){
  console.log("restful 9000 server is running")
});
