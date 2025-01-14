import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  getPosts,
  deletePost,
  updatePost,
} from "../controllers/post.controller.js";

const router = express.Router();

// POST REQUEST
router.post("/create/", verifyToken, create);

// GET REQUEST
router.get("/getPosts/", getPosts);

// DELETE REQUEST
router.delete(`/deletePost/:postId/:userId`, verifyToken, deletePost);

// PUT REQUEST
router.put("/updatePost/:postId/:userId", verifyToken, updatePost);

export { router as postRoutes };
