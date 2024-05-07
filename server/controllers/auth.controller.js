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
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(400).send({ message: " user is not registered !" });
      return;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ message: "password is incorrect !" });
    }
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
      .send({ message: "Login Successfull", user, token });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Intern Error",
      error: error.message,
    });
  }
}
