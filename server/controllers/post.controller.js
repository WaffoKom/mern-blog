import { postModel } from "../models/post.model.js";

export const create = async (req, res) => {
  // Vérifiez si l'utilisateur est un administrateur
  console.log(req.user, req.params);
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
  const newPost = new postModel({
    ...req.body,
    userId: req.user.userId,
    slug,
  });

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
