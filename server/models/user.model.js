import mongoose from "mongoose";
// import hashPassword from "../services/users/user.hashPassword.js";

const userSchema = new mongoose.Schema({
  // Je met en commentaire au cas ou un systeme prefererait id a _id
  // id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  timestamps: true,
  // role: { type: String, enum: ["admin", "user"] },
});

const User = mongoose.model("User", userSchema);

export { User as userModel };
