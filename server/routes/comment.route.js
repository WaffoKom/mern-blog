import express from "express";
import {
  createComment,
  getPostComments,
  likeComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// POST REQUEST

router.post("/create", verifyToken, createComment);

// GET REQUEST

router.get("/getPostComments/:postId", getPostComments);

// PUT REQUEST
router.put("/likeComment/:commentId", verifyToken, likeComment);

export { router as commentRoutes };
