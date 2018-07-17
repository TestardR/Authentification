var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    LocalStrategy           = require("passport-local"),
    User                    = require("./models/user"),
    passportLocalMongoose   = require("passport-local-mongoose")

mongoose.connect("mongodb://localhost:27017/auth_demo", { useNewUrlParser: true });
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==========
// ROUTES 
// ==========

app.get("/", function(req, res){
    res.render("home.ejs");
});

app.get("/secret",isLoggedIn, function(req, res){
   res.render("secret.ejs"); 
});
// AUTH ROUTES 
// Show sign up form
app.get("/register", function(req, res){
    res.render("register.ejs");
});
// Handling user sign in
app.post("/register", function(req, res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render("/register")
        } 
            passport.authenticate("local")(req, res, function(){
               res.redirect("/secret"); 
            });
    });
});

// LOGIN ROUTES
// render login form
app.get("/login", function(req, res){
    res.render("login");
});
// login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started.......");
});