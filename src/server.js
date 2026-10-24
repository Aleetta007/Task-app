
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
  ],
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Todo List API is running!" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

app.use("/api/tasks", taskRoutes);

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB unavailable:", error.message);
    console.log("Starting API without database connection.");
  }

  app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
}

startServer();
