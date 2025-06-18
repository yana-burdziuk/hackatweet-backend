// Importing mongoose
const mongoose = require('mongoose');

// Creating hashtagSchema
const hashtagSchema = mongoose.Schema({
    content: String
})

// Compiling hashtagSchema into Hashtag model
const Hashtag = mongoose.model("hashtags", hashtagSchema)

// Exporting Hashtag model
module.exports = Hashtag;