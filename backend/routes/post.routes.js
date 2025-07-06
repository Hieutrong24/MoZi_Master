import express from "express";
import {
  createPost,
  getFriendPosts,
  deletePost,
  updatePost,
  getPostsByUser,
  likePost,
  commentPost,
} from "../controllers/post.controller.js";

import authorize from "../middlewares/authorize.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

 
router.post(
  "/",
  authorize,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createPost
);

 
router.get("/feed", authorize, getFriendPosts);

 
router.delete("/:id", authorize, deletePost);
router.put("/:id/like", authorize, likePost);
router.post("/:id/comment", authorize, commentPost);

 
router.put(
  "/:id",
  authorize,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updatePost
);

 
router.get("/user/:userId", authorize, getPostsByUser);

export default router;
