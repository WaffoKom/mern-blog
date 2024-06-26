import bcrypt from "bcrypt";
import { userModel } from "../models/user.model.js";

export const test = (req, res) => {
  res.json({ message: "API is working !" });
};

export async function updateUser(req, res) {
  if (req.user.id !== req.params.userId) {
    return res.status(403).json("You are not allowed to update this user");
  }

  if (req.body.password) {
    if (body.password.length < 6) {
      return res.status(400).json("Password must be at least 6 characters");
    }
    req.body.password = bcrypt.hash(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return res
        .status(400)
        .json("Username must be between 7 and 20 characters");
    }
  }
  if (req.body.username.includes(' ')) {
    return res.status(400).json("Username cannot contain spaces");
  }
  if (req.body.username !== req.body.username.toLowerCase()) {
    return res.status(400).json("Username must be lowercase");
  }
  if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
    return res
      .status(400)
      .json("Username must be contain only letters  and numbers");
  }
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          profilePicture: req.body.profilePicture,
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser.toObject();
   return res.status(200).json(rest);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Intern error", error: error.message });
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
  return  res.status(400).json({ message: "Intern Error", error: error.message });
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
    return res.status(400).json({message :"Intern error",  error: error.message})
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
    return res.status(400).json({message :"Intern error", error :error.message});
  }
};
