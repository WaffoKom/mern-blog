import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
    unique: true,
  },

  image: {
    type: String,
    default:
      "https://th.bing.com/th/id/OIP.Aho2g7ivtBgM3YkDiihJqAHaE_?w=600&h=405&rs=1&pid=ImgDetMain",
  },
  category: {
    type: String,
    default: "uncategorized",
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);

export { Post as postModel };
