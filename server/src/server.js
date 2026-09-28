import "dotenv/config";
import http from "http";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { registerSocketHandlers } from "./socket/socket.js";

const app = express();
const server = http.createServer(app);
const origin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin, credentials: true }));
app.use(express.json());

app.get("/api/health", (_, res) => res.json({ message: "TeamFlow API is running" }));
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);

const io = new Server(server, { cors: { origin, credentials: true } });
registerSocketHandlers(io);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
