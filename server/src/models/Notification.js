import mongoose from "mongoose";

const schema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  message: { type: String, required: true, maxlength: 300 },
  type: { type: String, enum: ["task", "team", "system"], default: "system" },
  read: { type: Boolean, default: false },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", default: null }
}, { timestamps: true });

export default mongoose.model("Notification", schema);
