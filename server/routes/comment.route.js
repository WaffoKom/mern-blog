import express from "express";
import {
  createComment,
  getPostComments,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// POST REQUEST

router.post("/create", verifyToken, createComment);

// GET REQUEST

router.get("/getPostComments/:postId", getPostComments);

export { router as commentRoutes };
