const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const fetchbloger = require("../../middlewares/fetchbloger")
const allModels = require("../../Databases/allModels")
// change the create method


router.post('/create', [
     body('title', "Enter a valid title").isLength({ min: 6, max: 50 }),
     body('programmingLanguage', "Enter The programming language"),
     body('description', "Enter the valid description").isLength({ min: 15 }),
     body('authorName', "Enter the author name").isLength({ max: 15 }),
], fetchbloger, async (req, res) => {

     const errors = validationResult(req)
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
          blogerid: req.bloger.id,
     };
     try {
          const blog1 = await Blogs.findOne({
               description: req.body.description
          })
          if (blog1) {
               res.send("blog aready exists");
          }
          else {

               const newBlog = await Blogs.create(bodyData);
               res.send(newBlog);
          }
     } catch (err) {
          res.status(400).send("some error occured");
     }
})
router.post("/update", [
     body('title', "Enter a valid title").isLength({ min: 6, max: 50 }),
     body('programmingLanguage', "Enter The programming language"),
     body('description', "Enter the valid description").isLength({ min: 15 }),
     body('authorName', "Enter the author name").isLength({ max: 15 }),
], fetchbloger, async (req, res) => {
     const { Blogs } = allModels;

     const errors = validationResult(req);
     // checkin the validation
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
          }
          const updatedBlog = await Blogs.findByIdAndUpdate(req.body._id, bodyData);
          const blog = await Blogs.findById(req.body._id);
          console.log(blog);
          res.send(blog);
     }
     catch (err) { res.status(400).send(err) }
})



router.get('/myblogs', fetchbloger, async (req, res) => {
     const { Blogs } = allModels;
     try {
          const myblogs = await Blogs.find({ blogerid: req.bloger.id })
          res.send(myblogs);
     } catch (err) { res.status(500).send(err) }
})


module.exports = router;