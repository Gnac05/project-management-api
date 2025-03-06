const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { getAllUsersWithTaskCount } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Routes pour les utilisateurs
router.post("/", authMiddleware, userController.createUser); // Création d'un utilisateur
router.get("/", authMiddleware, userController.getAllUsers); // Liste de tous les utilisateurs
router.get("/:id", authMiddleware, userController.getUserById); // Un utilisateur spécifique avec la liste des projets qui lui sont assignés
// router.get("/with-stats", authMiddleware, getAllUsersWithTaskCount); // Liste de tous les utilisateurs avec stat.

module.exports = router;
