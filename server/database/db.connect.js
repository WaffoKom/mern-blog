import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connectToDB() {
  const mongoDBURL = process.env.DB_URL;

  try {
    const db = await mongoose.connect(mongoDBURL);
    console.log("Connecté à la base de données MongoDB");
    return db;
  } catch (error) {
    console.log({
      message: "Erreur de connexion à la base de données :",
      error: error.message,
    });
    return error;
  }
}

export async function closeConnexion() {
  await mongoose.connection.close();
  console.log("Connexion à la base de données fermée");
}
