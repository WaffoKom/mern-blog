import express from "express";
import {
  createComment,
  getPostComments,
  likeComment,
  editComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// POST REQUEST

router.post("/create", verifyToken, createComment);

// GET REQUEST

router.get("/getPostComments/:postId", getPostComments);
router.get("/getComments/", verifyToken, getComments);

// PUT REQUEST
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.put("/editComment/:commentId", verifyToken, editComment);
// DELETE REQUEST
router.delete("/deleteComment/:commentId", verifyToken, deleteComment);

export { router as commentRoutes };
