import express from "express";
import { uploadStoryMedia } from "../middlewares/upload.js";
import Story from "../models/story.model.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

// POST /api/story
router.post("/api/story", authorize, uploadStoryMedia, async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "Không có file tải lên" });
    }

    const folder = file.mimetype.startsWith("video") ? "videos" : "images";

    const story = await Story.create({
      user: req.user._id,
      mediaUrl: `/uploads/${folder}/${file.filename}`,
      mediaType: file.mimetype.startsWith("video") ? "video" : "image",
    });

    res.json({ success: true, story });
  } catch (err) {
    console.error("Lỗi đăng story:", err);
    res.status(500).json({ success: false, message: "Lỗi đăng story" });
  }
});

// GET /api/story/all
router.get("/api/story/all", async (req, res) => {
  try {
    const stories = await Story.find()
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.json({ success: true, stories });
  } catch (err) {
    console.error("Lỗi lấy story:", err);
    res.status(500).json({ success: false });
  }
});

export default router;
