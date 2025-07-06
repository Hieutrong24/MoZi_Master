 
import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ["image", "video"], required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 } 
});

export default mongoose.model("Story", storySchema);
