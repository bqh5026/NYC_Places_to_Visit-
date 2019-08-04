//jshint esversion:6

const express        = require("express"),
      app            = express(),
      bodyParser     = require("body-parser"),
      mongoose       = require("mongoose"),
      flash          = require("connect-flash"),
      passport       = require("passport"),
      LocalStrategy  = require("passport-local"),
      methodOverride = require("method-override"),
      Place          = require("./models/place"),
      Comment        = require("./models/comment"),
      User           = require("./models/user")

const commentRoutes = require("./routes/comments"),
      placeRoutes   = require("./routes/places"),
      indexRoutes    = require("./routes/index")

mongoose.connect(process.env.DATABASEURL || 'mongodb://localhost:27017/nyc_places', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));


app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.use(express.static(__dirname+ '/public'));

app.use(require("express-session")({
    secret: "sesame",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/nyc_places", placeRoutes);
app.use("/nyc_places/:id/comments", commentRoutes);


let port = process.env.PORT;
if (port == null || port =="") {
  port =3000;
}


app.listen(port, function(){
    console.log("Server is running");
});

//process.env.PORT, process.env.IP,//

// app.listen(3000, function(){
//   console.log("Server is running");
// });
