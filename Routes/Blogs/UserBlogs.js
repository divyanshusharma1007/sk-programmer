const express = require('express');
const router = express.Router();
const allModels = require('../../Databases/allModels');
const fetchusers = require('../../middlewares/fetchuser');

// Route to handle liking a blog
router.post("/like", fetchusers, async (req, res) => {
    const { Blogs } = allModels;
    const userid = req.user.id;
    const blogid = req.body._id;

    try {
        // Find the blog by its ID
        const blog = await Blogs.findById(blogid);

        if (!blog) {
            return res.status(500).send("Some error occurred"); // Send an error response if the blog is not found
        }

        // Add the user's ID to the list of likes
        let like = blog.likes;
        like.push(userid);

        // Remove duplicates from the list of likes
        let setlike = [...new Set(like)];

        // Update the blog's 'likes' field with the new list of likes
        const newblog = await Blogs.findByIdAndUpdate(req.body._id, { likes: setlike });

        // Retrieve the updated blog
        const bloglike = await Blogs.findById(blogid);

        res.status(200).send(bloglike); // Send the updated blog as a response
    } catch (err) {
        res.status(400).send("Some error occurred"); // Handle and send an error response if there's an issue
    }
});

// Route to handle adding a comment to a blog
router.post("/comment", fetchusers, async (req, res) => {
    const { Blogs } = allModels;
    const userid = req.user.id;
    const blogid = req.body._id;

    try {
        // Find the blog by its ID
        const blog = await Blogs.findById(blogid);

        if (!blog) {
            return res.status(500).send("Some error occurred"); // Send an error response if the blog is not found
        }

        // Add a new comment to the blog's 'comments' array
        blog.comments.push({
            userid: userid,
            comment: req.query.comment
        });

        // Update the blog with the new comment
        const commentedBlog = await Blogs.findByIdAndUpdate(blogid, blog);

        // Send the updated blog as a response
        res.status(200).send(await Blogs.findById(blogid));
    } catch (e) {
        res.status(500).send("Some error occurred"); // Handle and send an error response if there's an issue
    }
});

module.exports = router;
