import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);

// PUT REQUEST

router.put("/update/:userId", verifyToken, updateUser);

export { router as userRoutes };
