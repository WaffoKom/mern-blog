import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";

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
