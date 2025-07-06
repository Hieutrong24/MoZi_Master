// backend/server.js
import express from "express";
import { configDotenv } from "dotenv";
configDotenv();

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import registerRoutes from "./routes/registerRoutes.js";
import friendRoutes from "./routes/friends.route.js";
import postRoutes from "./routes/post.routes.js";

import cors from "cors";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import path from "path";
import { server, app, io } from "./socket/socket.js";
import storyRoutes from "./routes/story.route.js";
 
const __dirname = path.resolve();

 
if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error(" Thiếu JWT_SECRET hoặc MONGO_URI trong .env");
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

 
app.use(
  cors({
    origin: "http://localhost:5189",  
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);
app.use("/api", registerRoutes); // Đăng ký
app.use("/api/friends", friendRoutes);
app.use("/api/posts", postRoutes);
app.use('/uploads', express.static(path.resolve('uploads')));
app.use(storyRoutes);

  
app.use(express.static(path.join(__dirname, "frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

 
const start = async () => {
  try {
    await connectDb();
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(" Lỗi khởi động server:", err.message);
    process.exit(1);
  }
};
// io.on("connection", (socket) => {
//   socket.on("sendMessage", ({ senderId, receiverId, message }) => {
//     const receiverSocketId = getReceiverSocketId(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", message);
//     }
//   });
// });

start();
