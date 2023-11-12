const express = require('express');
const router = express.Router();
const fetchAuthority = require('../../middlewares/fetchAuthority');
const allModels = require("../../Databases/allModels");
const { body, validationResult } = require('express-validator');

// Route to get all blogs awaiting approval
router.get("/non-aproved-blogs", fetchAuthority, async (req, res) => {
    const { Blogs } = allModels;
    const page = parseInt(req.query.page) || 1; // Get the requested page number, default to page 1
    const blogsPerPage = parseInt(req.query.perPage) || 10; // Number of blogs per page, default to 10

    try {
        const skip = (page - 1) * blogsPerPage; // Calculate how many blogs to skip
        // Retrieve blogs with 'approved' set to false (awaiting approval) with pagination
        const sendBLogs = await Blogs.find({ approved: false })
            .skip(skip)
            .limit(blogsPerPage);

        res.status(200).send(sendBLogs);
    } catch (err) {
        res.status(500).send(err); // Handle and send an error response if there's an issue
    }
});

// Route to change the status (approve/reject) of a blog
router.put("/change-status", fetchAuthority, async (req, res) => {
    const { Blogs } = allModels;
    console.log(req.body)
    const id = req.body._id;
    try {
        if (!req.body.approved) { 
            console.log(req.body.approved)
            // Update the 'approved' status of the blog
            const blogs = await Blogs.findByIdAndUpdate(req.body._id, { ...req.body,approved: true });
            // Retrieve the updated blog
            const sendblogs = await Blogs.findById(id);
            console.log(sendblogs)
            res.send(sendblogs);
        } else {
            res.status(400).send("Wrong credentials"); // Send a message if the 'status' is not a Boolean
        }
    } catch (error) {
        res.status(500).send("Error occurred"); // Handle and send an error response if there's an issue
    }
});

// Route to update a blog's information
router.put("/update-blog", fetchAuthority, [
    body('title', "Enter a valid title").isLength({ min: 6, max: 50 }),
    body('programmingLanguage', "Enter the programming language"),
    body('description', "Enter a valid description").isLength({ min: 15 }),
    body('authorName', "Enter the author name").isLength({ max: 15 }),
], async (req, res) => {
    const { Blogs } = allModels;
    console.log("Update blog by authority is running");
    try {
        const bodyData = {
            title: req.body.title,
            programmingLanguage: req.body.programmingLanguage,
            image: req.body.image,
            description: req.body.description,
            hashtags: req.body.hashtags,
            comments: req.body.comments,
            approved: req.body.approved,
        };
        // Update the blog with the specified '_id' using the provided data
        const updatedBlog = await Blogs.findByIdAndUpdate(req.body._id, bodyData);
        // Retrieve the updated blog
        const blog = await Blogs.findById(req.body._id);
        res.send(blog);
    } catch (err) {
        res.status(400).send(err); // Handle and send an error response if there's an issue
    }
});

// Route to delete a blog
router.delete("/delete-blog", fetchAuthority, async (req, res) => {
    const { Blogs } = allModels;
    try {
        // Delete the blog with the specified '_id'
        await Blogs.findByIdAndDelete(req.body._id);
        res.send({ deleted: true, data: "Deleted successfully" });
    } catch (err) {
        res.send("Some error occurred"); // Handle and send an error response if there's an issue
    }
});

module.exports = router;
