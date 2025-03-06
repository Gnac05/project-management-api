const User = require("../models/User");
const Task = require("../models/Task");
const Project = require("../models/Project");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
// const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
    const { name, email, password, role } = req.body;

    // Vérification de l'existence de l'email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }

    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "developer",
    });

    await newUser.save();
    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password"); // Récupérer l'utilisateur sans le mot de passe
  
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      // Récupérer les tâches où cet utilisateur est responsable
      const tasks = await Task.find({ responsible: user._id }).select("project").popular('task');
  
      // Extraire les IDs de projets uniques à partir des tâches
      const projectIds = [...new Set(tasks.map(task => task.project.toString()))];
  
      // Récupérer les projets correspondants
      const projects = await Project.find({ _id: { $in: projectIds } });
  
      res.status(200).json({
        ...user.toObject(),
        projects, // Ajouter la liste des projets
      });
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  };

  const getAllUsersWithTaskCount = async (req, res) => {
    try {
        const users = await User.find().select("name email");  // Récupérer tous les utilisateurs
        console.log("Users:", users);
        const usersWithTaskCount = await Promise.all(users.map(async (user) => {
            const tasks = await Task.find({ responsible: user._id });

            const nbrToDo = tasks.filter(t => t.status === "To Do").length;
            const nbrInProgress = tasks.filter(t => t.status === "In Progress").length;
            const nbrDone = tasks.filter(t => t.status === "Done").length;

            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                nbrToDo,
                nbrInProgress,
                nbrDone
            };
        }));

        res.status(200).json(usersWithTaskCount);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports = { createUser, getAllUsers, getUserById, getAllUsersWithTaskCount };
