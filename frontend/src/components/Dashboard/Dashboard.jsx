import { useContext, useEffect, useState } from "react";
import UserList from "../UserList/UserList";
import Conversation from "../Conversation/Conversation";
import { getConversation } from "../../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = ({ }) => {
  const { authState } = useContext(AuthContext);
  const [currentConversationUser, setCurrentConversationUser] = useState({});
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCurrentConversation = async () => {
      setLoading(true);
      try {
        if (!currentConversationUser._id) return;
        const res = await getConversation(currentConversationUser._id);
        if (!res.success) return toast.error(res.msg);
        setConversations(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getCurrentConversation();
  }, [currentConversationUser]);

  return (
    <UserList
      setCurrentConversationUser={setCurrentConversationUser}
    />
  );
};
export default Dashboard;

{/* <div className="w-2/3">
          {currentConversationUser._id ? (
            <Conversation
              loading={loading}
              currentConversationUser={currentConversationUser}
              conversations={conversations}
              setConversations={setConversations}
            />
          ) : (
            <div className="flex justify-center items-center h-full">
              <div className="flex justify-center flex-col items-center gap-4">
                <h1 className="text-2xl font-bold">
                  Welcome 👋 {authState.name} 😘
                </h1>
                <p className="text-lg opacity-50">
                  Select a chat to start messaging
                </p>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-chat-dots "
                    viewBox="0 0 16 16"
                  >
                    <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                    <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div> */}
