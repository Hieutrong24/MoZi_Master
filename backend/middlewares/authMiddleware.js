import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddlewares = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, msg: "Bạn chưa đăng nhập" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId); // hoặc decoded.id

    if (!user) {
      return res.status(401).json({ success: false, msg: "Không tìm thấy người dùng" });
    }

    req.user = user; 
    next();
  } catch (err) {
    return res.status(401).json({ success: false, msg: "Xác thực thất bại" });
  }
};

export default authMiddlewares;
