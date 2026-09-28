import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/token.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: "Email already registered" });
    const user = await User.create({ name, email: email.toLowerCase(), password: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase() });
    if (!user || !(await bcrypt.compare(req.body.password || "", user.password)))
      return res.status(401).json({ message: "Invalid email or password" });
    res.json({ token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get("/me", protect, (req, res) => res.json({ user: req.user }));
export default router;
