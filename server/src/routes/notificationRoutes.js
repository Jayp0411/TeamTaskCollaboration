import express from "express";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.get("/", async (req, res) => {
  res.json(await Notification.find({ recipient: req.user._id })
    .populate("sender", "name").populate("task", "title")
    .sort({ createdAt: -1 }).limit(30));
});

router.patch("/:id/read", async (req, res) => {
  const n = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id }, { read: true }, { new: true }
  );
  if (!n) return res.status(404).json({ message: "Notification not found" });
  res.json(n);
});

router.patch("/read-all", async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
  res.json({ message: "All notifications marked read" });
});

export default router;
