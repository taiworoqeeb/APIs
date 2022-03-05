const express = require("express");
const postController = require("../controllers/postController");

const router = express.Router();

router
.route('/')
.post(postController.CreatePost)
.get(postController.getAllPosts);

router
.route('/:id')
.put(postController.UpdatePost)
.delete(postController.DeletePost)
.get(postController.getPost);

module.exports = router;
