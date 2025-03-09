import { connectToDB } from "./src/config/db.connect.js";
import { authRoutes } from "./src/routes/auth.route.js";
import { userRoutes } from "./src/routes/user.route.js";
import { postRoutes } from "./src/routes/post.route.js";
import { commentRoutes } from "./src/routes/comment.route.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});
app.use(cookieParser());
async function main() {
  // ... (Code de configuration de l'application)

  // app.get("/", (req, res) => {
  //   res.status(200).send("Hello world");
  // });

  app.use("/api/user", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/post", postRoutes);
  app.use("/api/comment", commentRoutes);

  await connectToDB();
  // ... (Démarrage du serveur)

  app.listen(PORT, () =>
    console.log(`Connexion etablit avec succes au port ${PORT}`)
  );
}
export default app;
main();
