import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  likes: {
    type: Array,
    default: [],
  },
  numberOfLikes: {
    type: Number,
    default: 0,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

export { Comment as commentModel };
