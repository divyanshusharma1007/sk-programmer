const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchbloger = require("../../middlewares/fetchbloger");
const allModels = require("../../Databases/allModels");

// Route to create a new blog

router.post('/create-blog', [
    // Express validator for request body validation
    body('title', "Enter a valid title").isLength({ min: 6, max: 50 }),
    body('programmingLanguage', "Enter the programming language"),
    body('description', "Enter a valid description").isLength({ min: 15 }),
    body('authorName', "Enter the author name").isLength({ max: 15 }),
], fetchbloger, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { Blogs } = allModels;
    const bodyData = {
        title: req.body.title,
        programmingLanguage: req.body.programmingLanguage,
        image: req.body.image,
        description: req.body.description,
        hashtags: req.body.hashtags,
        authorName: req.body.authorName,
        blogerid: req.bloger.id, // Assign the authenticated bloger's ID to the blog
    };
    try {
        const blog1 = await Blogs.findOne({
            description: req.body.description
        });
        if (blog1) {
            res.send("Blog already exists"); // Send a message if a blog with the same description exists
        } else {
            const newBlog = await Blogs.create(bodyData); // Create a new blog using the provided data
            res.send(newBlog); // Send the newly created blog as a response
        }
    } catch (err) {
        res.status(400).send("Some error occurred"); // Handle and send an error response if there's an issue
    }
});

// Route to update a blog's information
router.put("/update-blog", [
    // Express validator for request body validation
    body('title', "Enter a valid title").isLength({ min: 6, max: 50 }),
    body('programmingLanguage', "Enter the programming language"),
    body('description', "Enter a valid description").isLength({ min: 15 }),
    body('authorName', "Enter the author name").isLength({ max: 15 }),
], fetchbloger, async (req, res) => {
    const { Blogs } = allModels;
    const errors = validationResult(req);
    // Checking the validation
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const bodyData = {
            title: req.body.title,
            programmingLanguage: req.body.programmingLanguage,
            image: req.body.image,
            description: req.body.description,
            hashtags: req.body.hashtags,
            authorName: req.body.authorName,
        };
        // Update the blog with the specified '_id' using the provided data
        const updatedBlog = await Blogs.findByIdAndUpdate(req.body._id, bodyData);
        // Retrieve the updated blog
        const blog = await Blogs.findById(req.body._id);
        console.log(blog);
        res.send(blog); // Send the updated blog as a response
    }
    catch (err) { res.status(400).send(err); } // Handle and send an error response if there's an issue
});

// Route to get blogs created by the authenticated bloger
router.get('/my-blogs', fetchbloger, async (req, res) => {
    const { Blogs } = allModels;
    const page = parseInt(req.query.page) || 1; // Get the requested page number, default to page 1
    const blogsPerPage = parseInt(req.query.perPage) || 10; // Number of blogs per page, default to 10

    try {
        const skip = (page - 1) * blogsPerPage; // Calculate how many blogs to skip
        const myblogs = await Blogs.find({ blogerid: req.bloger.id })
            .skip(skip)
            .limit(blogsPerPage); // Find blogs with pagination

        res.send(myblogs); // Send the list of paginated blogs as a response
    } catch (err) {
        res.status(500).send(err); // Handle and send an error response if there's an issue
    }
});

module.exports = router;
