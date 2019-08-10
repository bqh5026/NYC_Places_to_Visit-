//jshint esversion: 6

const mongoose = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
}); 

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
