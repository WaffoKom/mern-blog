import bcrypt from "bcrypt";
import { userModel } from "../models/user.model.js";

export const test = (req, res) => {
  res.json({ message: "API is working !" });
};

export async function updateUser(req, res) {
  // Vérifier que l'utilisateur courant est autorisé à mettre à jour cet utilisateur
  if (req.user.id !== req.params.userId) {
    return res
      .status(403)
      .json({ error: "You are not allowed to update this user" });
  }

  // Récupérer les données à mettre à jour
  const { username, email, password, profilePicture } = req.body;

  const updateData = {};

  // Mettre à jour le nom d'utilisateur si fourni
  if (username) {
    if (
      typeof username !== "string" ||
      username.length < 7 ||
      username.length > 20
    ) {
      return res.status(400).json({
        error: "Username must be a string between 7 and 20 characters",
      });
    }
    updateData.username = username.trim().toLowerCase().replace(/\s+/g, "");
    if (!/^[a-zA-Z0-9]+$/.test(updateData.username)) {
      return res
        .status(400)
        .json({ error: "Username must contain only letters and numbers" });
    }
  }

  // Mettre à jour l'e-mail si fourni
  if (email) {
    if (typeof email !== "string" || !/.+@.+\..+/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    updateData.email = email;
  }

  // Mettre à jour le mot de passe si fourni
  if (password) {
    if (typeof password !== "string" || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be a string of at least 6 characters" });
    }
    updateData.password = await bcrypt.hash(password, 10);
  }

  // Mettre à jour la photo de profil si fournie
  if (profilePicture) {
    updateData.profilePicture = profilePicture;
  }

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...rest } = updatedUser.toObject();
    return res.status(200).json(rest);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

export const deleteUser = async (req, res) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return res.status(403).json("You are not allowed to delete this user");
  }

  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.userId);
    if (deletedUser) {
      res.status(200).json(deletedUser);
    } else {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  } catch (error) {
    // Gérez les erreurs de manière appropriée
    return res
      .status(400)
      .json({ message: "Erreur interne du serveur", error: error.message });
  }
};

export const signout = (req, res) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Intern Error", error: error.message });
  }
};

export const getUsers = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json("You are not allowed to see all users");
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await userModel
      .find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user.toObject();
      return rest;
    });
    const totalUsers = await userModel.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await userModel.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res
      .status(200)
      .json({ users: usersWithoutPassword, totalUsers, lastMonthUsers });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Intern error", error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    if (!user) {
      res.status(404).json("User not found !");
    }
    const { password, ...rest } = user.toObject();
    res.status(200).json(rest);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Intern error", error: error.message });
  }
};
