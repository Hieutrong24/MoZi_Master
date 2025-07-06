import express from "express";
import User from "../models/user.model.js";
import authorize from "../middlewares/authorize.js";
import userController from "../controllers/user.controller.js";
const router = express.Router();

// GỬI LỜI MỜI KẾT BẠN
router.post("/request", authorize, async (req, res) => {
  const { toUserId } = req.body;
  const fromUserId = req.user._id;

  if (!toUserId) return res.status(400).json({ success: false, msg: "Thiếu toUserId" });
  if (toUserId === fromUserId.toString()) return res.status(400).json({ success: false, msg: "Không thể gửi lời mời cho chính mình" });

  try {
    const [toUser, fromUser] = await Promise.all([
      User.findById(toUserId),
      User.findById(fromUserId),
    ]);

    if (!toUser || !fromUser) {
      return res.status(404).json({ success: false, msg: "Người dùng không tồn tại" });
    }

    if (toUser.friends.includes(fromUserId)) {
      return res.status(400).json({ success: false, msg: "Đã là bạn bè" });
    }

    if (toUser.friendRequests.includes(fromUserId)) {
      return res.status(400).json({ success: false, msg: "Đã gửi lời mời trước đó" });
    }

    if (fromUser.friendRequests.includes(toUserId)) {
      // Tự động chấp nhận nếu người kia đã gửi lời mời trước
      fromUser.friendRequests = fromUser.friendRequests.filter(id => id.toString() !== toUserId);
      toUser.friends.push(fromUserId);
      fromUser.friends.push(toUserId);
      await Promise.all([toUser.save(), fromUser.save()]);
      return res.json({ success: true, msg: "Đã chấp nhận lời mời và trở thành bạn bè" });
    }

    toUser.friendRequests.push(fromUserId);
    await toUser.save();

    res.json({ success: true, msg: "Đã gửi lời mời kết bạn" });
  } catch (err) {
    console.error("Lỗi khi gửi lời mời:", err);
    res.status(500).json({ success: false, msg: "Lỗi server" });
  }
});

// CHẤP NHẬN LỜI MỜI
router.post("/accept", authorize, async (req, res) => {
  const { fromUserId } = req.body;
  const toUserId = req.user._id;

  if (!fromUserId) return res.status(400).json({ success: false, msg: "Thiếu fromUserId" });

  try {
    const [fromUser, toUser] = await Promise.all([
      User.findById(fromUserId),
      User.findById(toUserId),
    ]);

    if (!fromUser || !toUser) {
      return res.status(404).json({ success: false, msg: "Người dùng không tồn tại" });
    }

    if (!toUser.friendRequests.includes(fromUserId)) {
      return res.status(400).json({ success: false, msg: "Không có lời mời kết bạn từ người này" });
    }

    // Xóa khỏi danh sách lời mời và thêm bạn
    toUser.friendRequests = toUser.friendRequests.filter(id => id.toString() !== fromUserId);
    toUser.friends.push(fromUserId);
    fromUser.friends.push(toUserId);

    await Promise.all([toUser.save(), fromUser.save()]);
    res.json({ success: true, msg: "Đã chấp nhận kết bạn" });
  } catch (err) {
    console.error("Lỗi khi chấp nhận:", err);
    res.status(500).json({ success: false, msg: "Lỗi server" });
  }
});

// TỪ CHỐI LỜI MỜI
router.post("/decline", authorize, async (req, res) => {
  const { fromUserId } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, msg: "Người dùng không tồn tại" });

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== fromUserId);
    await user.save();

    res.json({ success: true, msg: "Đã từ chối lời mời kết bạn" });
  } catch (err) {
    console.error("Lỗi khi từ chối:", err);
    res.status(500).json({ success: false, msg: "Lỗi server" });
  }
});

 
// HỦY LỜI MỜI ĐÃ GỬI
router.post("/cancel", authorize, async (req, res) => {
  const { toUserId } = req.body;
  const fromUserId = req.user._id;

  try {
    const toUser = await User.findById(toUserId);

    if (!toUser) {
      return res.status(404).json({ success: false, msg: "Người nhận không tồn tại" });
    }

    const originalLength = toUser.friendRequests.length;

 
    toUser.friendRequests = toUser.friendRequests.filter(
      id => id.toString() !== fromUserId.toString()
    );

 
    if (toUser.friendRequests.length === originalLength) {
      return res.status(400).json({ success: false, msg: "Lời mời không tồn tại để hủy" });
    }

    await toUser.save();

    return res.json({ success: true, msg: "Đã hủy lời mời kết bạn" });
  } catch (err) {
    console.error("Lỗi khi hủy lời mời:", err);
    return res.status(500).json({ success: false, msg: "Lỗi server" });
  }
});


// GỠ BẠN
router.post("/remove", authorize, async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user._id;

  try {
    const [user, friend] = await Promise.all([
      User.findById(userId),
      User.findById(friendId),
    ]);

    if (!user || !friend) {
      return res.status(404).json({ success: false, msg: "Người dùng không tồn tại" });
    }

    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId);

    await Promise.all([user.save(), friend.save()]);
    res.json({ success: true, msg: "Đã gỡ bạn thành công" });
  } catch (err) {
    console.error("Lỗi khi gỡ bạn:", err);
    res.status(500).json({ success: false, msg: "Lỗi server" });
  }
});

// LẤY DANH SÁCH BẠN BÈ
router.get("/list", authorize, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("friends", "name email avatar")
      .lean();

    res.json({ success: true, data: user?.friends || [] });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách bạn:", err);
    res.status(500).json({ success: false, msg: "Lỗi server" });
  }
});

// routes/friends.route.js
router.get("/list/:userId", authorize, userController.getFriends);

// LẤY DANH SÁCH LỜI MỜI ĐÃ GỬI
router.get("/sent", authorize, async (req, res) => {
  try {
    const users = await User.find({ friendRequests: req.user._id })
      .select("name email avatar")
      .lean();

    res.json({ success: true, data: users });
  } catch (err) {
    console.error("Lỗi khi lấy lời mời đã gửi:", err);
    res.status(500).json({ success: false, msg: "Lỗi server" });
  }
});

// LẤY DANH SÁCH LỜI MỜI NHẬN ĐƯỢC
router.get("/requests", authorize, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("friendRequests", "name email avatar")
      .lean();

    res.json({ success: true, data: user?.friendRequests || [] });
  } catch (err) {
    console.error("Lỗi khi lấy lời mời nhận:", err);
    res.status(500).json({ success: false, msg: "Lỗi server" });
  }
});

export default router;
