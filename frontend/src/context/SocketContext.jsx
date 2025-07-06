import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authState, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    let newSocket;

    if (isAuthenticated && authState?._id) {
      newSocket = io(import.meta.env.VITE_BACKEND_URL, {
        query: {
          userId: authState._id,
        },
        withCredentials: true, 
      });

      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      console.log(" Socket connected with userId:", authState._id);
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
        console.log(" Socket disconnected");
      }
    };
  }, [isAuthenticated, authState?._id]);

  return (
    <SocketContext.Provider value={{ onlineUsers, socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
