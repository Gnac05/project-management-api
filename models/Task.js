const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom de la tâche est obligatoire"],
    },
    description: {
      type: String,
      required: [true, "La description de la tâche est obligatoire"],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Le projet associé est obligatoire"],
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    responsible: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Le responsable associé est obligatoire"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
