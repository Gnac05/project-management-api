const express = require("express");
const { body } = require("express-validator");
const { 
  createProject, 
  getProjects, 
  getAllProjectsWithTaskCount,
  getProjectById, 
  updateProject, 
  deleteProject 
} = require("../controllers/projectController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Créer un projet
router.post(
  "/",
  authMiddleware,
  [body("name").notEmpty().withMessage("Le nom du projet est obligatoire")],
  createProject
);

// ✅ Obtenir tous les projets
router.get("/", authMiddleware, getProjects);

// ✅ Obtenir la stat. de tous les projets
router.get("/stats", authMiddleware, getAllProjectsWithTaskCount);

// ✅ Obtenir un projet par son ID
router.get("/:id", authMiddleware, getProjectById);

// ✅ Mettre à jour un projet
router.patch(
  "/:id",
  authMiddleware,
  [body("name").optional().notEmpty().withMessage("Le nom ne peut pas être vide")],
  updateProject
);

// ✅ Supprimer un projet
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;
