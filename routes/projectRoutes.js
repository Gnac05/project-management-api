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
/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Gestion des projets
 */

// ✅ Créer un projet
/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Créer un nouveau projet
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nouveau projet"
 *               description:
 *                 type: string
 *                 example: "Description du projet"
 *     responses:
 *       201:
 *         description: Projet créé avec succès
 */
router.post(
  "/",
  authMiddleware,
  [body("name").notEmpty().withMessage("Le nom du projet est obligatoire")],
  createProject
);

// ✅ Obtenir tous les projets
/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Récupérer tous les projets
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Liste des projets
 */
router.get("/", authMiddleware, getProjects);

// ✅ Obtenir la stat. de tous les projets
/**
 * @swagger
 * /projects/stats:
 *   get:
 *     summary: Récupérer tous les projets avec le nombre de tâches par statut
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Liste des projets avec statistiques
 */
router.get("/stats", authMiddleware, getAllProjectsWithTaskCount);

// ✅ Obtenir un projet par son ID
/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Récupérer un projet avec ses tâches et responsables
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *     responses:
 *       200:
 *         description: Détails du projet
 *       404:
 *         description: Projet non trouvé
 */
router.get("/:id", authMiddleware, getProjectById);

// ✅ Mettre à jour un projet
/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     summary: Modifier un projet
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Projet mis à jour
 *       404:
 *         description: Projet non trouvé
 */
router.patch(
  "/:id",
  authMiddleware,
  [body("name").optional().notEmpty().withMessage("Le nom ne peut pas être vide")],
  updateProject
);

// ✅ Supprimer un projet
/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Supprimer un projet et ses tâches associées
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Projet supprimé
 *       404:
 *         description: Projet non trouvé
 */
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;
