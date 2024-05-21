import express from "express";
import { createComment } from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// POST REQUEST

router.post("/create", verifyToken, createComment);

export { router as commentRoutes };
