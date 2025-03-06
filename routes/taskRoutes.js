const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");

// Routes pour les tâches
router.post("/", authMiddleware, taskController.createTask); // Création d'une tâche
router.get("/", authMiddleware, taskController.getAllTasks); // Liste de toutes les tâches
router.get("/:id", authMiddleware, taskController.getTaskById); // Une tâche spécifique
router.patch("/:id", authMiddleware, taskController.updateTask); // Mise à jour d'une tâche
router.delete("/:id", authMiddleware, taskController.deleteTask); // Suppression d'une tâche

module.exports = router;
