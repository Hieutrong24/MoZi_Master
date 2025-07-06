import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
const authorize = async (req, res, next) => {
  const token = req.cookies.token;
  // console.log(" [authorize] Token từ cookie:", token);

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized", success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ msg: "Unauthorized", success: false });
    }

    // console.log(" [authorize] User hiện tại:", user);  

    req.user = user;
    next();
  } catch (error) {
    console.error(" [authorize] Lỗi xác thực:", error);
    res.status(401).json({ msg: "Unauthorized", success: false });
  }
};

export default authorize;
