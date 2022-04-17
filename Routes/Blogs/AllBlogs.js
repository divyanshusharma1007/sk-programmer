const express = require('express')
const router = express.Router()
const allModels = require("../../Databases/allModels")
router.get("/allblogs", async (req, res) => {
     const { Blogs } = allModels
     try {
          const allblogs = await Blogs.find();
          if (!allblogs) { return res.send("some error occured") }
          res.send(allblogs)
     } catch (err) {
          res.status(400).send("some error occured");
     }
})

router.get("/targetblog", async (req, res) => {
     const blogid = req.header('blogid')
     const { Blogs } = allModels;
     try {
          const blog = await Blogs.findById(blogid)
          if (!blog) return res.status(400).send("some error occured");
          res.send(blog);
     } catch (err) {
          res.status(400).send("some error occured");
     }
})

module.exports = router