import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create, getPosts } from "../controllers/post.controller.js";

const router = express.Router();

// POST REQUEST

router.post("/create/", verifyToken, create);

// GET REQUEST

router.get("/getPosts/", getPosts);
export { router as postRoutes };
