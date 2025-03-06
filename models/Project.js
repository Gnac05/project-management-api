const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String , default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    //users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Liste des utilisateurs impliqués
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }] // Liste des tâches du projet
  },
  { timestamps: true } // Ajoute createdAt et updatedAt automatiquement
);

module.exports = mongoose.model("Project", projectSchema);
