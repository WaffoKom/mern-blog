import { postModel } from "../models/post.model.js";

export const create = async (req, res) => {
  // Vérifiez si l'utilisateur est un administrateur
  const userId = req.user.id;
  console.log(userId);
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
  const newPost = new postModel({ ...req.body, slug, userId });

  try {
    // Sauvegardez le nouvel article dans la base de données
    const savedPost = await newPost.save();
    res.status(201).send(savedPost);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erreur interne", error: error.message });
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
            {
              content: {
                $regex: { $regex: req.query.searchTerm, $options: "i" },
              },
            },
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
    res.status(500).send({ message: "Intern Error", error: error.message });
  }
};
