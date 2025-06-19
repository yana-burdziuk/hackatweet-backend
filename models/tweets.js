// Importing mongoose
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Creating tweetSchema
const tweetSchema = mongoose.Schema({
    user: {type: Schema.Types.ObjectId, ref:"users"},
    text: String,
    hashtags: [{type: Schema.Types.ObjectId, ref:"hashtags"}]
})

// Compiling tweetSchema into Tweet model
const Tweet = mongoose.model("tweets", tweetSchema)

// Exporting Tweet model
module.exports = Tweet;