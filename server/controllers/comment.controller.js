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
    return res
      .status(404)
      .json({ message: "Intern Error", error: error.message });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const comments = await commentModel
      .find({ postId: req.params.postId })
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Intern Error", error: error.message });
  }
};

export const getComments = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json("You are not allowed to see all comments");
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    const comments = await commentModel
      .find()
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await commentModel.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await commentModel.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await commentModel.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json("Comment not found");
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes += 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(404).json({ message: "Intern Error", error: error.message });
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
    return res
      .status(404)
      .json({ message: "Intern Error", error: error.message });
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
    return res
      .status(404)
      .json({ message: "Intern Error", error: error.message });
  }
};
