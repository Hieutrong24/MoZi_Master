// backend/socket/socket.js
import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5189"],  
    methods: ["GET", "POST"],
    credentials: true,
  },
});


const userSocketMap = {};


export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// Sự kiện socket
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("👤 Kết nối:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("Online users:", userSocketMap);

    // Gửi danh sách online cho tất cả client
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }


  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    try {
      const newMsg = await Message.create({ senderId, receiverId, message });

      const sender = await User.findById(senderId).select("name avatar");

      const fullMessage = {
        ...newMsg._doc,
        senderId: {
          _id: sender._id,
          name: sender.name,
          avatar: sender.avatar,
        },
      };

      const receiverSocketId = getReceiverSocketId(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", fullMessage);
      }

     
      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("newMessage", fullMessage);
      }
    } catch (err) {
      console.error(" Lỗi xử lý sendMessage:", err.message);
    }
  });

 
  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      console.log("Ngắt kết nối:", userId);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});


export { io, server, app };
