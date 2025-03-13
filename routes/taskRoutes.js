const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Gestion des tâches
 */

// Routes pour les tâches
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Ajouter une tâche à un projet
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, project, status, responsible]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nouvelle tâche"
 *               description:
 *                 type: string
 *                 example: "Description de la tâche"
 *               project:
 *                 type: string
 *                 example: "652d3f0b5f6d6e001e8c1f8a"
 *               status:
 *                 type: string
 *                 enum: ["To Do", "In Progress", "Done"]
 *               responsible:
 *                 type: string
 *                 example: "652d3f0b5f6d6e001e8c1f8a"
 *     responses:
 *       201:
 *         description: Tâche créée avec succès
 */
router.post("/", authMiddleware, taskController.createTask); // Création d'une tâche

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Récupérer toutes les tâches
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Liste des tâches
 */
router.get("/", authMiddleware, taskController.getAllTasks); // Liste de toutes les tâches

/**
 * @swagger
 * /tasks/{projectId}:
 *   get:
 *     summary: Récupérer les tâches d'un projet
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des tâches du projet
 *       404:
 *         description: Projet non trouvé
 */
router.get("/:id", authMiddleware, taskController.getTaskById); // Une tâche spécifique

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Modifier une tâche
 *     tags: [Tasks]
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
 *               title:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: ["To Do", "In Progress", "Done"]
 *     responses:
 *       200:
 *         description: Tâche mise à jour
 *       404:
 *         description: Tâche non trouvée
 */
router.patch("/:id", authMiddleware, taskController.updateTask); // Mise à jour d'une tâche

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Supprimer une tâche
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tâche supprimée
 *       404:
 *         description: Tâche non trouvée
 */
router.delete("/:id", authMiddleware, taskController.deleteTask); // Suppression d'une tâche

module.exports = router;
