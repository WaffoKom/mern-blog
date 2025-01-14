import mongoose from "mongoose";
// import hashPassword from "../services/users/user.hashPassword.js";

const userSchema = new mongoose.Schema({
  // Je met en commentaire au cas ou un systeme prefererait id a _id
  // id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
  username: {
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
  },
  profilePicture: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // role: { type: String, enum: ["admin", "user"] },
});

const User = mongoose.model("User", userSchema);

export { User as userModel };
