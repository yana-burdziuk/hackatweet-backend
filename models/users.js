// Importing mongoose
const mongoose = require('mongoose');

// Creating userSchema
const userSchema = mongoose.Schema({
    username: String,
    firstName: String,
    password: String,
    token: String
})

// Compiling userSchema into User model
const User = mongoose.model("users", userSchema)

// Exporting User model
module.exports = User;