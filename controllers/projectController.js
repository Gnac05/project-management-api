const { validationResult } = require("express-validator");
const Project = require("../models/Project");
const Task = require("../models/Task");

// ✅ Créer un projet
const createProject = async (req, res) => {
  try {
    console.log("Données reçues :", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("Données utilisateur :", req.user);
    const project = new Project({
      name: req.body.name,
      description: req.body.description || "",
      createdBy: req.user.id, // L'utilisateur authentifié
    });

    console.log("My Project :", project);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ✅ Obtenir tous les projets
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message  });
  }
};

// ✅ Obtenir un projet par son ID
const getProjectById = async (req, res) => {
  try {
    // Vérification que l'ID est bien fourni dans les paramètres de la requête
    if (!req.params.id) {
        return res.status(400).json({ message: "ID du projet est requis" });
      }
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    // Récupérer toutes les tâches associées à ce projet
    const tasks = await Task.find({ project: project._id })
      .populate("responsible", "-password") // Afficher l'objet responsible sans le mot de passe
      .select("-project"); // Ne pas inclure les détails du projet, juste son ID

    res.json({
      ...project.toObject(),
      tasks, // Ajouter la liste des tâches au projet
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message  });
  }
};

// ✅ Mettre à jour un projet
const updateProject = async (req, res) => {
  try {
    console.log("My Request :", req.body);

    // Vérification que l'ID est bien fourni dans les paramètres de la requête
    if (!req.params.id) {
        return res.status(400).json({ message: "ID du projet est requis" });
      }
    let project = await Project.findById(req.params.id);
    console.log("My Project :", project);

    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    /*if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Accès refusé" });
    }*/
    
    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;

    project.updatedAt = new Date();

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message  });
  }
};

// ✅ Supprimer un projet
const deleteProject = async (req, res) => {
  try {
    // Vérification que l'ID est bien fourni dans les paramètres de la requête
    if (!req.params.id) {
        return res.status(400).json({ message: "ID du projet est requis" });
      }
    console.log("My Porject ID :", req.params.id);
    const project = await Project.findById(req.params.id);
    console.log("My Project :", project);
    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    // if (project.createdBy.toString() !== req.user.id) {
    //   return res.status(403).json({ message: "Accès refusé" });
    // }

    // Supprimer toutes les tâches associées au projet
    await Task.deleteMany({ project: project._id });

    await project.deleteOne();
    res.json({ message: "Projet supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message  });
  }
};

// ✅ Obtenir la statistique des projets
const getAllProjectsWithTaskCount = async (req, res) => {
    try {
      const projects = await Project.find().select("title description");
  
      const projectStats = await Promise.all(
        projects.map(async (project) => {
          const tasks = await Task.find({ project: project._id }).select("status");
  
          const nbrToDo = tasks.filter(task => task.status === "To Do").length;
          const nbrInProgress = tasks.filter(task => task.status === "In Progress").length;
          const nbrDone = tasks.filter(task => task.status === "Done").length;
  
          return {
            _id: project._id,
            name: project.name,
            description: project.description,
            nbrToDo,
            nbrInProgress,
            nbrDone,
          };
        })
      );
  
      res.status(200).json(projectStats);
    } catch (error) {
      console.error("Erreur lors de la récupération des projets:", error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  };
  

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  getAllProjectsWithTaskCount,
  updateProject,
  deleteProject,
};
