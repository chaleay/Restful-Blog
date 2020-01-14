var express      =  require("express"),
expressSanitizer =  require("express-sanitizer"),
methodOverride   =  require("method-override"),
bodyParser       =  require("body-parser"),
mongoose         =  require('mongoose');
app              =  express();

//start mongoose client
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/restfulBlogApp', {useNewUrlParser: true});

//use and set for express app
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}

});
//to delete one entry from db
//db.blogs.deleteOne( { "_id" : ObjectId("5e176a3d7d6f9021e4a2a292") } );
//set up database using the schema we created
var Blog = mongoose.model("Blog", blogSchema);

/*test create**
Blog.create({
    title: "My Rags to Riches Story",
    image: "https://images.unsplash.com/photo-1526509569184-2fe126e71cd3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
    body: "Hello this is Elijah's first blog post"

});
*/ 
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//Restful Routes
app.get("/blogs", function(req, res){
   Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index", {blogs: blogs}); //second var refers to one passed through in function
        }
   });

});

//new route
app.get("/blogs/new", function(req, res){
    res.render("new");

});

//create route
app.post("/blogs", function(req, res){
    //create blog, then redirect
    //referring back to form, blog[title] refers to req.body.blog.title
    //sanitize body - remove script tags from body since allowing user to type in html for body
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    var data = req.body.blog;
    Blog.create(data, function(err, newBlog){
        if(err){
            console.log(err);
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

//show route
app.get("/blogs/:id", function(req, res){
    //find the blog with the id specificed in the get request url
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show", {blog : foundBlog});
        }
    });

});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    //first use id to find correct blog
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit", {blog : foundBlog});
        }
    });
});


//update route - use method_override package 
app.put("/blogs/:id", function(req, res){
    //sanitize code - remove script tags
    req.body.blog.body = req.sanitize(req.body.blog.body);

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/" + updatedBlog._id);
        }
        
    });

});

//delete route
app.delete("/blogs/:id", function(req, res){
    //destroy and redirect
    Blog.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.send(err);
        }
        else{
            res.redirect("/blogs");
        }
    });
    
    
});


app.listen(3000, function(){
    console.log("server is running...");

});
