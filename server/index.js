import { connectToDB } from "./database/db.connect.js";
import { userRoutes } from "./routes/user.route.js";
import { authRoutes } from "./routes/auth.route.js";
import { postRoutes } from "./routes/post.route.js";
import { commentRoutes } from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import path from "path";

import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.LOCALHOST],
    credentials: true,
  })
);
const __dirname = path.resolve();
app.use(cookieParser());
async function main() {
  // ... (Code de configuration de l'application)

  app.use("/api/user", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/post", postRoutes);
  app.use("/api/comment", commentRoutes);
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });

  await connectToDB();
  // ... (Démarrage du serveur)

  app.listen(PORT, () =>
    console.log(`Connexion etablit avec succes au port ${PORT}`)
  );
}

main();
