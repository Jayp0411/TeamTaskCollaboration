import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, default: "", maxlength: 2000 },
  status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  dueDate: { type: Date, default: null },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

schema.index({ team: 1, status: 1 });
schema.index({ assignee: 1, dueDate: 1 });

export default mongoose.model("Task", schema);
