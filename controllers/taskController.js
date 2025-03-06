const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

const createTask = async (req, res) => {
  try {
    const { name, description, project, status, responsible } = req.body;

    // Vérifier si le projet existe
    const foundProject = await Project.findById(project);    
    if (!foundProject) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    // Vérifier si l'utilisateur responsable existe
    const foundUser = await User.findById(responsible);
    if (!foundUser) {
        return res.status(404).json({ message: "Responsable non trouvé" });
      }

    const newTask = new Task({
      name,
      description,
      project,
      status,
      responsible,
    });

    await newTask.save();

    foundProject.tasks.push(newTask._id);
    await foundProject.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Erreur lors de la création de la tâche:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        .populate("responsible", "-password") // Récupérer tous les détails du responsable sauf le mot de passe
        .populate("project"); // Récupérer les détails du projet

        if (!task) {
        return res.status(404).json({ message: "Tâche non trouvée" });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error("Erreur lors de la récupération de la tâche:", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    if (req.body.name) task.name = req.body.name;
    if (req.body.description) task.description = req.body.description;
    if (req.body.status) task.status = req.body.status;
    if (req.body.responsible) task.responsible = req.body.responsible;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    // Supprimer la tâche du projet
    const project = await Project.findById(task.project);
    if (project) {
      project.tasks = project.tasks.filter(
        (taskId) => taskId.toString() !== task._id.toString()
      );
      await project.save();
    }

    await task.deleteOne();
    res.status(200).json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };
