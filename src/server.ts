import dotenv from 'dotenv';
dotenv.config();
import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db";
import taskRoutes from "./routes/task.routes";
import authRoutes from "./routes/auth.routes";


const app: Application = express();


app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

app._router.stack.forEach((r: any) => {
    if (r.route && r.route.path) {
      console.log(`✅ Registered route: ${r.route.path}`);
    }
  });
  

connectDB();


app.get("/", (req, res) => {
  res.send("Task Manager API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
