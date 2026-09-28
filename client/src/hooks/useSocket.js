import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
  autoConnect: false
});

export function useSocket(onUpdate) {
  const { user } = useAuth();
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    socket.auth = { token };

    const refresh = () => onUpdateRef.current?.();

    const joinTeams = async () => {
      try {
        const { data: teams } = await api.get("/teams");
        teams.forEach(team => socket.emit("join-team", team._id));
      } catch {
        return;
      }
    };

    socket.on("connect", joinTeams);
    socket.on("task-created", refresh);
    socket.on("task-updated", refresh);
    socket.on("task-deleted", refresh);

    if (!socket.connected) {
      socket.connect();
    } else {
      joinTeams();
    }

    return () => {
      socket.off("connect", joinTeams);
      socket.off("task-created", refresh);
      socket.off("task-updated", refresh);
      socket.off("task-deleted", refresh);
      socket.disconnect();
    };
  }, [user]);

  return socket;
}
