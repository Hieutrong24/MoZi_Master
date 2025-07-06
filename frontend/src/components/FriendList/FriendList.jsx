import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const FriendList = () => {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const address = "http://localhost:3000";

  // Khởi tạo socket khi có authState._id
  useEffect(() => {
    if (authState?._id) {
      const newSocket = io(address, {
        query: { userId: authState._id },
      });
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (onlineUserIds) => {
        setOnlineUsers(onlineUserIds);
      });

      return () => newSocket.disconnect();
    }
  }, [authState?._id]);

  // Lấy users và friends khi đã có authState
  useEffect(() => {
    if (authState?._id) {
      fetchUsers();
      fetchFriends();
    }
  }, [authState?._id]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${address}/api/user/all`, {
        withCredentials: true,
      });
      if (Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người dùng:", err);
      toast.error("Không thể tải danh sách người dùng");
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await axios.get(`${address}/api/friends/list`, {
        withCredentials: true,
      });
      setFriends(res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bạn bè:", err);
    }
  };

  const isFriend = (userId) => {
    return friends.some((friend) => friend._id === userId);
  };

  return (
    <div className="col-lg-3 d-none d-lg-block p-0">
      <div className="scroll-on-hover vh-100 overflow-hidden"style={{height:'60vh'}}>
        <div className="border border-2 rounded-3 shadow p-3 bg-white">
          <h5 className="text-center">Danh sách người dùng</h5>
          <ul className="navbar-nav flex-column p-3">
            {users.length > 0 ? (
              users.map((user) => (
                <li className="nav-item mb-3" key={user._id}><Link to={`/profile/${user._id}`} key={user._id} className="text-decoration-none">
                  <div className="text-decoration-none text-dark">
                    <div className="row row-cols-3 align-items-center">
                      <div className="col-2">
                        <img
                          src={user.avatar}
                          className="rounded-circle border border-2"
                          style={{ width: "40px", height: "40px", objectFit: "cover" }}
                          alt={`Avatar of ${user.name}`}
                        />
                      </div>
                      <div className="col-6">
                        <strong>{user.name}</strong>
                        <br />
                        <small className="text-muted">
                          {user.bio || "Chưa có mô tả"}
                        </small>
                        <br />
                        <small
                          className={`badge mt-1 ${
                            onlineUsers.includes(user._id)
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                        </small>
                      </div>
                      <div className="col-2 ms-auto">
                        {isFriend(user._id) ? (
                          <button
                            className="btn btn-success rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "30px", height: "30px" }}
                            disabled
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "30px", height: "30px" }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div></Link>
                </li>
              ))
            ) : (
              <li className="nav-item text-center text-muted">
                Không có người dùng nào khác
              </li>
            )}
            <li>
              <div className="row">
                <Button
                  className="btn btn-outline-info text-decoration-none w-100"
                  onClick={() => navigate("/friends")}
                >
                  Xem thêm
                </Button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FriendList;
