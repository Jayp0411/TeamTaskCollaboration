import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Team from "../models/Team.js";

let ioInstance = null;

export function registerSocketHandlers(io) {
  ioInstance = io;

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", socket => {
    const userId = String(socket.user._id);
    socket.join(`user:${userId}`);

    socket.on("join-team", async teamId => {
      try {
        const isMember = await Team.exists({
          _id: teamId,
          members: socket.user._id
        });

        if (isMember) socket.join(`team:${teamId}`);
      } catch {
        return;
      }
    });

    socket.on("leave-team", teamId => {
      if (teamId) socket.leave(`team:${teamId}`);
    });
  });
}

export function emitToTeam(teamId, event, data) {
  if (!ioInstance || !teamId) return;
  ioInstance.to(`team:${teamId}`).emit(event, data);
}
