import express from "express";
import Team from "../models/Team.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { createNotification } from "../utils/notify.js";

const router = express.Router();
router.use(protect);

router.get("/", async (req, res) => {
  const teams = await Team.find({ members: req.user._id })
    .populate("owner", "name email").populate("members", "name email").sort({ createdAt: -1 });
  res.json(teams);
});

router.post("/", async (req, res) => {
  try {
    const team = await Team.create({
      name: req.body.name,
      description: req.body.description || "",
      owner: req.user._id,
      members: [req.user._id]
    });
    await team.populate([{ path: "owner", select: "name email" }, { path: "members", select: "name email" }]);
    res.status(201).json(team);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.post("/:id/members", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    if (String(team.owner) !== String(req.user._id)) return res.status(403).json({ message: "Only the owner can add members" });

    const user = await User.findOne({ email: req.body.email?.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!team.members.some(id => String(id) === String(user._id))) {
      team.members.push(user._id);
      await team.save();
      await createNotification({
        recipient: user._id, sender: req.user._id,
        message: `You were added to team "${team.name}".`, type: "team"
      });
    }

    await team.populate([{ path: "owner", select: "name email" }, { path: "members", select: "name email" }]);
    res.json(team);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

export default router;
