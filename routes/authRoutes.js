const express = require("express");
const { body } = require("express-validator");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// Route d'inscription
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
router.post(
  "/login",
  [
    body("email", "Veuillez entrer un email valide").isEmail(),
    body("password", "Le mot de passe est obligatoire").exists(),
  ],
  login
);

module.exports = router;
