require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");


// Middleware
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Autoriser les requêtes cross-origin
app.use(morgan("dev")); // Logger les requêtes HTTP

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur MongoDB :", err));

const User = require("./models/User");
const Project = require("./models/Project");
const Task = require("./models/Task");

// Vérification des modèles
console.log("✅ Modèles chargés :", { User, Project, Task });
  

// Route de test
app.get("/", (req, res) => {
  res.send("API Gestion de Projet 🚀");
});
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
