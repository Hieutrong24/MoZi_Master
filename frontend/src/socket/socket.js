import { io } from "socket.io-client";

 
const currentUserId = localStorage.getItem("userId"); 

const socket = io("http://localhost:3000", {
  query: { userId: currentUserId },
});

export default socket;
