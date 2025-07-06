import { useSocketContext } from "../../../context/SocketContext";

const UserItem = ({ user, setCurrentConversationUser }) => {
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(user._id);

  return (
    <div
      className="flex items-center justify-between border-b border-slate-600 p-4"
      onClick={() => setCurrentConversationUser(user)}
    >
      <div className="flex items-center gap-4 ">
        <div className={`avatar ${isOnline ? "online" : ""} `}>
          <div className="mask mask-squircle h-12 w-12">
            <img src={user.avatar} alt={user.name} />
          </div>
        </div>
        <div>
          <div className="font-bold">{user.name}</div>
        </div>
      </div>
    </div>
  );
};
export default UserItem;
