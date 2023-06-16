const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const imageUpload = require("../middlewares/imageUpload");
const postController = require("../controllers/post.controller");
const {
  validatePostData,
  validationResult,
} = require("../middlewares/postValidator");

router.post(
  "/",
  imageUpload,
  validatePostData,
  validationResult,
  postController.createPost
);
router.get("/", postController.getAllPosts);
router.get("/:slug", postController.getAllPostsBySlug);
router.patch(
  "/:id",
  checkAuth,
  validatePostData,
  validationResult,
  postController.updatePost
);
router.delete("/:id", checkAuth, postController.deletePostById);

module.exports = router;
