// createUser.js

import mongoose from "mongoose";
import User from "./models/user.model.js"; 
import bcrypt from "bcryptjs";
const MONGO_URI = "mongodb://localhost:27017/LocalMoZiDB"; 

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Đã kết nối MongoDB");

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash("123456",salt);
    const newUser = await User.create({
      name: "mozi123",
      full_name: "Hiếu Trọng",
      email: "tronghieungo20@gmail.com",
      password: hashedpassword,
      gender: "male",
      avatar: "./frontend/Images/Avarta/th(1).jpg",
      bio: "Xin chào, tôi là MoZi!",
    });

    console.log("🎉 Tạo thành công:", newUser);
    process.exit(0); 
  } catch (err) {
    console.error("Lỗi:", err.message);
    process.exit(1);
  }
};

run();
