import express from "express";
const router = express.Router();
import authorize from "../middlewares/authorize.js";
import User from "../models/user.model.js";

 
router.get("/all", authorize, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("name email avatar"); // chỉ lấy thông tin cần thiết

    res.json({ success: true, users });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    res.status(500).json({ success: false, msg: "Lỗi server" });
  }
});

// API: Lấy thông tin user theo ID
router.get("/:id", authorize, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email avatar bio");
    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Lỗi khi lấy người dùng theo ID:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

 
router.get("/me", authorize, async (req, res) => {
  console.log("DATA CURRENT USERs:", req.user); 
  return res.json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
    },
  });
});
export default router;
