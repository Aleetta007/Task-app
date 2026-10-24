
import express from "express";
import mongoose from "mongoose";
import Task from "../models/Task.js";

const router = express.Router();

// Temporary storage used only when MongoDB is disconnected.
let temporaryTasks = [];

const databaseConnected = () =>
  mongoose.connection.readyState === 1;

// GET all tasks
router.get("/", async (req, res) => {
  try {
    if (!databaseConnected()) {
      return res.json(temporaryTasks);
    }

    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// CREATE a task
router.post("/", async (req, res) => {
  try {
    const title = req.body.title?.trim();

    if (!title || title.length > 200) {
      return res.status(400).json({
        message: "Title must contain 1–200 characters",
      });
    }

    if (!databaseConnected()) {
      const task = {
        _id: new mongoose.Types.ObjectId().toString(),
        title,
        completed: false,
        createdAt: new Date(),
      };

      temporaryTasks.unshift(task);
      return res.status(201).json(task);
    }

    const task = await Task.create({ title });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to create task" });
  }
});

// UPDATE title or completion status
router.patch("/:id", async (req, res) => {
  try {
    const updates = {};

    if (typeof req.body.title === "string") {
      const title = req.body.title.trim();

      if (!title || title.length > 200) {
        return res.status(400).json({
          message: "Title must contain 1–200 characters",
        });
      }

      updates.title = title;
    }

    if (typeof req.body.completed === "boolean") {
      updates.completed = req.body.completed;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid updates provided",
      });
    }

    if (!databaseConnected()) {
      const index = temporaryTasks.findIndex(
        task => task._id === req.params.id
      );

      if (index === -1) {
        return res.status(404).json({ message: "Task not found" });
      }

      temporaryTasks[index] = {
        ...temporaryTasks[index],
        ...updates,
      };

      return res.json(temporaryTasks[index]);
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    res.status(500).json({ message: "Failed to update task" });
  }
});

// DELETE a task
router.delete("/:id", async (req, res) => {
  try {
    if (!databaseConnected()) {
      const previousLength = temporaryTasks.length;

      temporaryTasks = temporaryTasks.filter(
        task => task._id !== req.params.id
      );

      if (temporaryTasks.length === previousLength) {
        return res.status(404).json({ message: "Task not found" });
      }

      return res.json({ message: "Task deleted successfully" });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    res.status(500).json({ message: "Failed to delete task" });
  }
});

export default router;
