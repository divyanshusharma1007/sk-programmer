const express = require('express')
const router = express.Router()
const fetchAuthority = require('../../middlewares/fetchAuthority')
const allModels = require("../../Databases/allModels")
const { body, validationResult } = require('express-validator')

router.get("/getallblogs", fetchAuthority, async (req, res) => {
     const { Blogs } = allModels;
     const sendBLogs = await Blogs.find({ aproved: false })
     res.status(200).send(sendBLogs);
})

router.post("/changestatus", fetchAuthority, async (req, res) => {
     const { Blogs } = allModels;
     const id = req.body._id
     try {
          if (typeof req.body.status === Boolean) {
               const blogs = await Blogs.findByIdAndUpdate(id, { aproved: req.body.status });
               const sendblogs = await Blogs.findById(id);
               res.send(sendblogs)
          }
          else {
               res.send("wrong cradentials")
          }
     } catch (error) {
          res.send("error occured");
     }
})

router.post("/update", fetchAuthority, [
     body('title', "Enter a valid title").isLength({ min: 6, max: 50 }),
     body('programmingLanguage', "Enter The programming language"),
     body('description', "Enter the valid description").isLength({ min: 15 }),
     body('authorName', "Enter the author name").isLength({ max: 15 }),
], async (req, res) => {
     const { Blogs } = allModels;
     console.log("update blog by authoriy is running")
     try {
          const bodyData = {
               title: req.body.title,
               programmingLanguage: req.body.programmingLanguage,
               image: req.body.image,
               description: req.body.description,
               hashtags: req.body.hashtags,
               comments: req.body.comments,
               aproved: req.body.aproved,
          }
          const updatedBlog = await Blogs.findByIdAndUpdate(req.body._id, bodyData);
          const blog = await Blogs.findById(req.body._id);
          res.send(blog);
     }
     catch (err) { res.status(400).send(err) }
})

router.post("/delete", fetchAuthority, async (req, res) => {
     const { Blogs } = allModels;
     try {
          await Blogs.findByIdAndDelete(req.body._id);
          res.send({ deleted: true, data: "deleted successfully" });
     }
     catch (err) {
          res.send("some error occured");
     }
})
module.exports = router;