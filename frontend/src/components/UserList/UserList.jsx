import { useContext, useEffect, useState } from "react";
import { getUsers, logout } from "../../services/api";
import UserItem from "./UserItem/UserItem";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const UserList = ({ setCurrentConversationUser }) => {
  const [users, setUsers] = useState([]);
  const { setAuthState, setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const handleGetUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    handleGetUsers();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await logout();
      if (!res.success) return toast.error(res.msg);
      toast.success(res.msg);
      localStorage.setItem("login_status", JSON.stringify(1));
      setIsAuthenticated(false);
      setAuthState({});
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {users.map((user) => (
        <UserItem
          key={user._id}
          user={user}
          setCurrentConversationUser={setCurrentConversationUser}
        />
      ))}
    </div>
  );
};
export default UserList;


{/* <button className="btn" onClick={handleLogout}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-box-arrow-right"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
          />
          <path
            fillRule="evenodd"
            d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
          />
        </svg>
      </button> */}