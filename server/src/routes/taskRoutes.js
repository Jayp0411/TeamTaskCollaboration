import express from "express";
import Task from "../models/Task.js";
import Team from "../models/Team.js";
import { protect } from "../middleware/auth.js";
import { createNotification } from "../utils/notify.js";
import { emitToTeam } from "../socket/socket.js";

const router = express.Router();
router.use(protect);

async function member(teamId, userId) {
  return Team.findOne({ _id: teamId, members: userId });
}

router.get("/", async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user._id }).select("_id");
    const filter = { team: req.query.team || { $in: teams.map(t => t._id) } };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.search) filter.title = { $regex: req.query.search, $options: "i" };

    const tasks = await Task.find(filter)
      .populate("team", "name")
      .populate("assignee", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    if (!await member(req.body.team, req.user._id)) {
      return res.status(403).json({ message: "You are not a team member" });
    }

    const task = await Task.create({
      ...req.body,
      dueDate: req.body.dueDate || null,
      createdBy: req.user._id
    });

    if (task.assignee && String(task.assignee) !== String(req.user._id)) {
      await createNotification({
        recipient: task.assignee,
        sender: req.user._id,
        message: `You were assigned "${task.title}".`,
        type: "task",
        task: task._id
      });
    }

    await task.populate([
      { path: "team", select: "name" },
      { path: "assignee", select: "name email" },
      { path: "createdBy", select: "name email" }
    ]);

    emitToTeam(task.team._id || task.team, "task-created", {
      action: "created",
      task
    });

    res.status(201).json(task);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (!await member(task.team, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(task, req.body);
    await task.save();

    await task.populate([
      { path: "team", select: "name" },
      { path: "assignee", select: "name email" },
      { path: "createdBy", select: "name email" }
    ]);

    emitToTeam(task.team._id || task.team, "task-updated", {
      action: "updated",
      task
    });

    res.json(task);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  if (!await member(task.team, req.user._id)) {
    return res.status(403).json({ message: "Access denied" });
  }

  const teamId = task.team;
  const taskId = task._id;
  await task.deleteOne();

  emitToTeam(teamId, "task-deleted", {
    action: "deleted",
    taskId
  });

  res.json({ message: "Task deleted" });
});

export default router;
