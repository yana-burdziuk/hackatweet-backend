// Importing mongoose
const mongoose = require('mongoose');

// Creating tweetSchema
const tweetSchema = mongoose.Schema({
    user: {type: ObjectId, ref:"users"},
    text: String,
    hashtag: {type: ObjectId, ref:"hashtags"}
})

// Compiling tweetSchema into Tweet model
const Tweet = mongoose.model("tweets", tweetSchema)

// Exporting Tweet model
module.exports = Tweet;