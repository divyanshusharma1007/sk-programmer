const express = require('express')
const router = express.Router();
const allModels = require('../../Databases/allModels')
const fetchusers = require('../../middlewares/fetchuser')
// like id
router.post("/like", fetchusers, async (req, res) => {
     const { Blogs } = allModels;
     const userid = req.user.id;
     const blogid = req.body._id;
     try {
          const blog = await Blogs.findById(blogid)
          if (!blog) return res.send(500).send("some error occured");
          let like = blog.likes;
          like.push(userid);
          let setlike = [...new Set(like)];
          const newblog = await Blogs.findByIdAndUpdate(req.body._id, { likes: setlike })
          const bloglike = await Blogs.findById(blogid);
          res.send(bloglike)
     } catch (err) {
          res.status(400).send("some error occured")
     }
})

router.post("/comment", fetchusers, async (req, res) => {
     const { Blogs } = allModels;
     const userid = req.user.id;
     const blogid = req.body._id;
     try {
          const blog = await Blogs.findById(blogid)
          if (!blog) return res.status(500).send("some error occured");
          blog.comments.push({
               userid: userid,
               comment: req.body.comment
          });
          const commentedBlog = await Blogs.findByIdAndUpdate(blogid, blog)
          res.status(200).send(await Blogs.findById(blogid))
     } catch (e) {
          res.status(500).send("some error occured");
     }
     // console.log(blog);
})
module.exports = router;