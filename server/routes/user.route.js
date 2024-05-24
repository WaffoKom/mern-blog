import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  signout,
  getUsers,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// PUT REQUEST
router.put("/update/:userId", verifyToken, updateUser);
// DELETE REQUEST
router.delete("/delete/:userId", verifyToken, deleteUser);
// POST REQUEST
router.post("/signout", signout);
//GET REQUEST
router.get("/test", test);
router.get("/getUsers", verifyToken, getUsers);
router.get("/:userId", getUser);
export { router as userRoutes };
