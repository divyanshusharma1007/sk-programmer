// Import the 'mongoose' library, which is used to connect to MongoDB
const mongoose = require('mongoose');

// Define a function 'connectToMongo' to establish a connection to the MongoDB database
const connectToMongo = () => {
    // Use the 'mongoose.connect' method to connect to the MongoDB database
    mongoose.connect(process.env.db_url, () => {
        // Callback function that gets executed when the connection is successful
        console.log("Connection is successful");
    });
}

// Export the 'connectToMongo' function so that it can be used in other parts of the application
module.exports = connectToMongo;
