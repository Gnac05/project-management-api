const express = require("express");
const { body } = require("express-validator");
const { register, login } = require("../controllers/authController");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Routes pour l'authentification
 */

// Route d'inscription
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d'un utilisateur
 *     tags: [Auth]
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
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@doe.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Le nom est obligatoire"),
    body("email").isEmail().withMessage("Veuillez entrer un email valide"),
    body("password").isLength({ min: 6 }).withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  ],
  register
);

// Route de connexion
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@doe.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants invalides
 */
router.post(
  "/login",
  [
    body("email", "Veuillez entrer un email valide").isEmail(),
    body("password", "Le mot de passe est obligatoire").exists(),
  ],
  login
);

module.exports = router;
