//jshint esversion: 6

const express = require("express"),
      router = express.Router(),
      Place = require("../models/place"),
      middleware = require("../middleware");

router.get("/", (req, res) =>{
    Place.find({}, (err, allPlaces) => {
        if(err) {
            console.log(err);
        } else {
            res.render("places/index", {places: allPlaces});
        }
    });

});

router.post("/", middleware.isLoggedIn, (req, res) =>{
    let name = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newPlace = {name: name, price: price, image: image, description: desc, author: author};
    Place.create(newPlace, (err, newlyCreated) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/nyc_places");
        }
    });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("places/new.ejs");
});

router.get("/:id", (req, res) => {
    Place.findById(req.params.id).populate("comments").exec((err, foundPlace) => {
       if(err) {
           console.log(err);
       } else {
           res.render("places/show.ejs", {place: foundPlace});
       }
    });
});

router.get("/:id/edit", middleware.checkPlaceOwnership, (req, res) => {
         Place.findById(req.params.id, (err, foundPlace) => {
                res.render("places/edit", {place: foundPlace});
                });
});

router.put("/:id", middleware.checkPlaceOwnership, (req, res) => {
     Place.findByIdAndUpdate(req.params.id, req.body.place, (err, updatedPlace) => {
         if(err) {
             res.redirect("/nyc_places");
         } else {
             res.redirect("/nyc_places/" + req.params.id);
         }
     });
 });

router.delete("/:id", middleware.checkPlaceOwnership, (req, res) => {
    Place.findByIdAndRemove(req.params.id, (err) => {
       if(err) {
           res.redirect("/nyc_places");
       } else {
           res.redirect("/nyc_places");
       }
    });
});



module.exports = router;
