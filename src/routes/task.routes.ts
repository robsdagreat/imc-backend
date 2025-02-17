import express from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();


router.use(protect);

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/add", createTask);
router.put("/edit/:id", updateTask);
router.delete("/delete/:id", deleteTask);

export default router;