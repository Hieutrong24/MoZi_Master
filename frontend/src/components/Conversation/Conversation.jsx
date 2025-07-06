import { useEffect, useState } from "react";
import { sendMessage } from "../../services/api";
import Message from "./Message/Message";
import { toast } from "react-toastify";
import "./style.css";
import { useSocketContext } from "../../context/SocketContext";

const Conversation = ({
  currentConversationUser,
  conversations,
  setConversations,
  loading,
}) => {
  const [message, setMessage] = useState("");
  const { socket } = useSocketContext();
  const [sendLoading, setSendLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message) return;
    setSendLoading(true);
    setTimeout(async () => {
      try {
        const res = await sendMessage(currentConversationUser._id, message);
        if (!res.success) return toast.error(res.msg);
        setConversations([...conversations, res.data]);
        setMessage("");
      } catch (error) {
        console.error(error);
      } finally {
        setSendLoading(false);
      }
    }, 2000);
  };

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setConversations([...conversations, newMessage]);
    });

    return () => socket?.off("newMessage");
  }, [message, conversations]);

  useEffect(() => {
    const scrollDiv = document.querySelector(".scrollbar");
    scrollDiv.scrollTop = scrollDiv.scrollHeight;
  }, [conversations]);

  return (
    <div className="h-full  flex flex-col justify-between ">
      <div className="px-4 py-1 bg-slate-600  ">
        to: {currentConversationUser.name}
      </div>
      <div className="scrollbar mb-3 h-full px-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-dots loading-xs"></span>
            <span className="loading loading-dots loading-sm"></span>
            <span className="loading loading-dots loading-md"></span>
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ) : conversations.length ? (
          conversations.map((conversation) => (
            <Message
              key={conversation._id}
              conversation={conversation}
              currentConversationUser={currentConversationUser}
            />
          ))
        ) : (
          <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-gray-400 font-bold text-xl mb-4">
              {/* have no message */}
              You and {currentConversationUser.name} are now connected!
            </h1>

            <span>
              {/* recommend user to chat */}
              <span className="text-gray-400">
                You can start by saying hi 👋
              </span>
            </span>
          </div>
        )}
      </div>
      <div className="px-4 pb-4">
        <label className="input input-bordered flex items-center gap-2   ">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            className="grow"
            placeholder="Send a message"
          />
          {sendLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <div
              onClick={handleSendMessage}
              className={`p-2 ${
                message && "bg-blue-500"
              } rounded-full cursor-pointer flex justify-center items-center`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className={`bi bi-send ${
                  message ? "opacity-1 text-white" : "opacity-50"
                } translate-x-[-1px] translate-y-[1px]`}
                viewBox="0 0 16 16"
              >
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
              </svg>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};
export default Conversation;
