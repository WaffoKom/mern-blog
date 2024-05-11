import bcrypt from "bcrypt";
import { userModel } from "../models/user.model.js";

export const test = (req, res) => {
  res.json({ message: "API is working !" });
};

export async function updateUser(req, res) {
  // if (req.user.id !== req.params.userId) {
  //   return res.status(403).json("You are not allowed to update this user");
  // }

  if (req.body.password) {
    if (body.password.length < 6) {
      return res.status(400).send("Password must be at least 6 characters");
    }
    req.body.password = bcrypt.hash(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return res
        .status(400)
        .send("Username must be between 7 and 20 characters");
    }
  }
  if (req.body.username.includes(" ")) {
    return res.status(400).send("Username cannot contain spaces");
  }
  if (req.body.username !== req.body.username.toLowerCase()) {
    return res.status(400).send("Username must be lowercase");
  }
  if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
    return res
      .status(400)
      .send("Username must be contain only letters  and numbers");
  }
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).send(rest);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Intern error", error: error.message });
  }
}
