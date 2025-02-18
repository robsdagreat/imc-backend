import { Response } from "express";
import  AuthRequest  from "../types"; // Import the custom type
import Task, { ITask } from "../models/task.model";

// Get tasks for the logged-in user
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id; // Extract user ID from the request object
    const tasks: ITask[] = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get a task by ID (only if it belongs to the logged-in user)
export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id; // Extract user ID from the request object
    const task: ITask | null = await Task.findOne({ _id: id});

    if (!task) {
      res.status(404).json({
        message: "The task you're looking for is missing",
      });
      return;
    }

    res.status(200).json({
      message: "Task retrieved successfully",
      task: task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
};

// Create a task (associate it with the logged-in user)
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description, priority, status } = req.body;
  // const userId = req.user?.id; // Extract user ID from the request object

  try {
    const newTask: ITask = new Task({ title, description, priority, status });
    await newTask.save();
    res.status(201).json({
      message: "Task added successfully",
      task: newTask,
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Update a task (only if it belongs to the logged-in user)
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.id; // Extract user ID from the request object

  try {
    const updatedTask: ITask | null = await Task.findOneAndUpdate(
      { _id: id}, // Ensure the task belongs to the user
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Delete a task (only if it belongs to the logged-in user)
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.id; // Extract user ID from the request object

  try {
    const deletedTask: ITask | null = await Task.findOneAndDelete({ _id: id });

    if (!deletedTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};