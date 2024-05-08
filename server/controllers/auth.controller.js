import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function signup(req, res) {
  const { username, email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (user) {
      return res.status(201).send({ message: " User already existed" });
    }
    const saltRounds = 10;
    let salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);
    console.log(hashPassword);

    const newUser = new userModel({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save();
    return res
      .status(201)
      .send({ success: true, message: "Signup successful ...!" });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Erreur interne",
      error: error.message,
    });
  }
}

export async function signin(req, res) {
  const { email, password: userPassword } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(400).send({ message: " user is not registered !" });
      return;
    }
    const validPassword = await bcrypt.compare(userPassword, user.password);
    if (!validPassword) {
      return res.status(400).send({ message: "password is incorrect !" });
    }
    const { password, ...rest } = user._doc;

    // const userWithoutPassword = {
    //   _id: user._id,
    //   email: user.email,
    //   username: user.username,
    //   // Autres propriétés de l'utilisateur que vous souhaitez inclure
    // };
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.KEY,
      {
        expiresIn: "24h",
      }
    );

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .send({ message: "Login Successfull", user: rest });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Intern Error",
      error: error.message,
    });
  }
}

export async function google(req, res) {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.KEY);
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnley: true,
        })
        .json(rest);
    } else {
      let generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const saltRounds = 10;
      let salt = await bcrypt.genSalt(saltRounds);
      const hashPassword = await bcrypt.hash(generatedPassword, salt);

      const newUser = new userModel({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-3),
        email,
        password: hashPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.KEY);
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Intern error", error: error.message });
  }
}
