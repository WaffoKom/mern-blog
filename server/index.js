import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: [process.env.LOCALHOST],
    credentials: true,
  })
);
async function main() {
  // ... (Code de configuration de l'application)

  //   await connectToDB();

  // ... (Démarrage du serveur)

  app.listen(PORT, () =>
    console.log(`Connexion etablit avec succes au port ${PORT}`)
  );
}

main();
