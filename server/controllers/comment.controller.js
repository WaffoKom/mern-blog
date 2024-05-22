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

export const getPostComments = async (req, res) => {
  try {
    const comments = await commentModel
      .find({ postId: req.params.postId })
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    throw error;
  }
};

export const likeComment = async (req, res) => {
  try {
    const comment = await commentModel.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json("Comment not found");
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (!userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    throw error;
  }
};

export const editComment = async (req, res) => {
  try {
    const comment = await commentModel.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json("Comment not found");
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json("You are not allowed to edit this comment");
    }
    const editedComment = await commentModel.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    throw error;
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await commentModel.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json("Comment not found");
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json("You are not allowed to delete this comment");
    }
    await commentModel.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Comment has been deleted");
  } catch (error) {
    throw error;
  }
};
