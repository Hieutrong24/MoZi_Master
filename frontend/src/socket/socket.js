import { io } from "socket.io-client";


const currentUserId = localStorage.getItem("userId");

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  query: { userId: currentUserId },
});

export default socket;
