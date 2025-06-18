// Importing mongoose
const mongoose = require('mongoose');

// Creating connection string
const connectionString = process.env.CONNECTION_STRING

// Establishing connection to DB
const connection = mongoose.connect(connectionString, {connectTimeoutMS: 2000})
.then(() => console.log('Database connected'))
.catch(error => console.error(error));

module.exports = connection;