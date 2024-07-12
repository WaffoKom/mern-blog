import { postModel } from "../models/post.model.js";
import Joi from "joi";

export const create = async (req, res) => {
  // Vérifiez si l'utilisateur est un administrateur

  if (!req.user.isAdmin) {
    return res.status(403).json("Vous n'êtes pas autorisé à créer un article");
  }

  // Vérifiez si les champs requis sont fournis
  if (!req.body.title || !req.body.content) {
    return res.status(400).json("Veuillez fournir tous les champs requis");
  }

  // Générez un slug à partir du titre de l'article
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");

  // Créez une nouvelle instance du modèle de post
  const newPost = new postModel({ ...req.body, slug, userId: req.user.id });

  try {
    // Sauvegardez le nouvel article dans la base de données
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Erreur interne", error: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await postModel
      .find({
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: "i" } },
            { content: { $regex: req.query.searchTerm, $options: "i" } },
          ],
        }),
      })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await postModel.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await postModel.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Intern error", error: error.message });
  }
};

export const deletePost = async (req, res) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return res.status(403).json("You are not allowed to delete this post");
  }
  try {
    await postModel.findByIdAndDelete(req.params.postId);
    return res.status(200).json("Post has been deleted");
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Intern Error", error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    // Validate the input data
    const { error } = validatePostUpdate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if the user is authorized to update the post
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post" });
    }

    // Find the post to be updated
    const post = await postModel.findById(req.params.postId);

    // If the post is not found, return an error
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update the post with the new data
    post.title = req.body.title;
    post.content = req.body.content;
    post.category = req.body.category;
    post.image = req.body.image;
    post.updatedAt = new Date();

    // Save the updated post
    const updatedPost = await post.save();

    // Return the updated post
    res.status(200).json(updatedPost);
  } catch (error) {
    // Handle any errors that may occur during the update process
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Function to validate the input data
function validatePostUpdate(data) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(10).required(),
    category: Joi.string().required(),
    image: Joi.string().uri().required(),
  });

  return schema.validate(data);
}
