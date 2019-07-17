var express = require("express");
var router = express.Router(); 
var Place = require("../models/place");
var middleware = require("../middleware");

router.get("/", function(req, res){
    Place.find({}, function(err, allPlaces){
        if(err) {
            console.log(err); 
        } else {
            res.render("places/index", {places: allPlaces});           
        }
    }); 
  
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price; 
    var image = req.body.image;
    var desc = req.body.description; 
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPlace = {name: name, price: price, image: image, description: desc, author: author};
    Place.create(newPlace, function(err, newlyCreated){
        if(err) {
            console.log(err); 
        } else {
            res.redirect("/nyc_places");             
        }
    });
}); 

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("places/new.ejs"); 
}); 

router.get("/:id", function(req, res){
    Place.findById(req.params.id).populate("comments").exec(function(err, foundPlace){
       if(err) {
           console.log(err);
       } else {
           res.render("places/show.ejs", {place: foundPlace}); 
       }
    });
}); 

router.get("/:id/edit", middleware.checkPlaceOwnership, function(req, res){
         Place.findById(req.params.id, function(err, foundPlace){
                res.render("places/edit", {place: foundPlace}); 
                }); 
}); 
 
router.put("/:id", middleware.checkPlaceOwnership, function(req, res){
     Place.findByIdAndUpdate(req.params.id, req.body.place, function(err, updatedPlace){
         if(err) {
             res.redirect("/nyc_places");
         } else {
             res.redirect("/nyc_places/" + req.params.id); 
         }
     });
 });

router.delete("/:id", middleware.checkPlaceOwnership, function(req, res){
    Place.findByIdAndRemove(req.params.id, function(err){
       if(err) {
           res.redirect("/nyc_places");
       } else {
           res.redirect("/nyc_places");
       }
    });
});



module.exports = router; 