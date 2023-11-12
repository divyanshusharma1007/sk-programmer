const express = require('express');
const router = express.Router();
const allModels = require("../../Databases/allModels");

// Route to get all blogs with pagination
router.get("/blogs", async (req, res) => {
     const { Blogs } = allModels;
     const page = parseInt(req.query.page) || 1; // Get the page number from the query parameters or default to page 1
     const perPage = parseInt(req.query.perPage) || 10; // Get the number of blogs per page from the query parameters or default to 10
 
     try {
         // Calculate the skip value to skip the appropriate number of blogs based on the page number and perPage
         const skip = (page - 1) * perPage;
 
         // Fetch blogs from the database with pagination
         const allblogs = await Blogs.find().skip(skip).limit(perPage);
 
         if (!allblogs || allblogs.length === 0) {
             return res.send("No blogs found"); // If no blogs are found on the specified page, send a message
         }
 
         res.send(allblogs); // Send the list of blogs for the specified page
     } catch (err) {
         res.status(400).send("Some error occurred"); // Handle and send an error response if there's an issue with the operation
     }
 });

// Route to get a specific target blog by ID
router.get("/target-blog/:id", async (req, res) => {
    const blogid = req.params.id; // Extract the blog ID from the request headers
    const { Blogs } = allModels;
    try {
        // Find the blog by its ID in the database
        const blog = await Blogs.findById(blogid);
        if (!blog) {
            return res.status(400).send("Some error occurred"); // If the blog is not found, send an error response
        }
        res.send(blog); // Send the specific blog as a response
    } catch (err) {
        res.status(400).send("Some error occurred"); // Handle and send an error response if there's an issue with the operation
    }
});

module.exports = router;
