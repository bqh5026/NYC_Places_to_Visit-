const express    = require("express"),
      router     = express.Router({mergeParams: true}),
      Place      = require("../models/place"), 
      Comment    = require("../models/comment"), 
      middleware = require("../middleware"); 

router.get("/new", middleware.isLoggedIn, (req, res) =>{
    Place.findById(req.params.id, (err, place) => {
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {place: place}); 
        }
    })
});

router.post("/", middleware.isLoggedIn, (req, res) => {
    Place.findById(req.params.id, (err, place) => {
        if(err) {
            console.log(err);
            res.redirec("/nyc_places"); 
        } else {
            Comment.create(req.body.comment, (err, comment) =>{
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err)     
                } else {
                    comment.author.id = req.user._id; 
                    comment.author.username = req.user.username;
                    comment.save(); 
                    place.comments.push(comment);
                    place.save();
                    req.flash("success", "Successfully added comment"); 
                    res.redirect('/nyc_places/' + place._id); 
                }
            });
        }
    });
}); 

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect('back');
        } else {
             res.render('comments/edit', {place_id: req.params.id, comment: foundComment}); 
        }
    })
}); 

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) =>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) =>{
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/nyc_places/" + req.params.id ); 
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) =>{
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            res.redirect('back');
        } else {
             req.flash("success", "Comment deleted"); 
             res.redirect("/nyc_places/" + req.params.id);
        }
    });
});

module.exports = router; 