import User from "../models/user.model.js";
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } });
    res.status(200).json({ data: users, success: true });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("name email avatar");
    res.json({ success: true, users });
  } catch (error) {
    console.error(" Lỗi getAllUsers:", error);
    res.status(500).json({ msg: "Lỗi server" });
  }
};
const getFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("friends", "name email avatar");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({
      count: user.friends.length,
      data: user.friends,
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách bạn bè:", err);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách bạn bè" });
  }
};


export default {
  getUsers,
  getAllUsers,
  getFriends,
};
