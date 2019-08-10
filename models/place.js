//jshint esversion: 6

const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    // address: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
     ]
  });

module.exports = mongoose.model("Place", placeSchema);
