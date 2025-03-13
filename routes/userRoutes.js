const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { getAllUsersWithTaskCount } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

// Routes pour les utilisateurs
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Ajouter un nouveau ustilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Joe Doe"
 *               email:
 *                 type: string
 *                 example: "joe@doe.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Tâche créée avec succès
 */
router.post("/", authMiddleware, userController.createUser); // Création d'un utilisateur

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get("/", authMiddleware, userController.getAllUsers); // Liste de tous les utilisateurs

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur avec ses projets
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur avec ses projets
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get("/:id", authMiddleware, userController.getUserById); // Un utilisateur spécifique avec la liste des projets qui lui sont assignés
// router.get("/with-stats", authMiddleware, getAllUsersWithTaskCount); // Liste de tous les utilisateurs avec stat.

module.exports = router;
