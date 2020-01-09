var express =   require("express"),
bodyParser =    require("body-parser"),
mongoose =      require('mongoose');
app =           express();

mongoose.connect('mongodb://localhost/restfulBlogApp');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}

});

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





app.listen(3000, function(){
    console.log("server is running...");

});
