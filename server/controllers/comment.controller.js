import { commentModel } from "../models/comment .model.js";

export const createComment = async (req, res) => {
  const { content, postId, userId } = req.body;
  try {
    if (userId !== req.user.id) {
      return res.status(403).json("You are not allowed to create this comment");
    }
    const newComment = new commentModel({
      content,
      postId,
      userId,
    });
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    throw error;
  }
};