import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarFriends from "./NavbarFriends";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [receivedRequests, setReceivedRequests] = useState([]);


  useEffect(() => {
    fetchCurrentUser();
    fetchFriends();
    fetchUsers();
    fetchSentRequests();
    fetchReceivedRequests();
  }, []);

  const fetchReceivedRequests = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/friends/requests", {
        withCredentials: true,
      });
      setReceivedRequests(res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi tải lời mời đã nhận:", err);
    }
  };


  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/user/me", { withCredentials: true });
      setCurrentUserId(res.data._id);
    } catch (err) {
      console.error("Không lấy được thông tin người dùng:", err);
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/friends/list", { withCredentials: true });
      setFriends(res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách bạn bè:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/all`, { withCredentials: true });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách người dùng:", err);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/friends/sent", { withCredentials: true });
      setSentRequests(res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi tải lời mời đã gửi:", err);
    }
  };

  const handleSendRequest = async (toUserId) => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/friends/request",
        { toUserId },
        { withCredentials: true }
      );
      toast.success(res.data.msg);
      await fetchSentRequests();
      await fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Gửi lời mời thất bại");
    }
  };

  const handleCancelRequest = async (toUserId) => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/friends/cancel",
        { toUserId },
        { withCredentials: true }
      );
      toast.success(res.data.msg);


      setSentRequests((prev) => prev.filter((u) => u._id !== toUserId));
    } catch (err) {
      toast.error(err.response?.data?.msg || "Hủy lời mời thất bại");
    }
  };

  const handleAccept = async (fromUserId) => {
    try {
      const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/friends/accept", { fromUserId }, { withCredentials: true });
      toast.success(res.data.msg);
      await fetchReceivedRequests();
      await fetchFriends();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Lỗi khi chấp nhận lời mời");
    }
  };

  const handleDecline = async (fromUserId) => {
    try {
      const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/friends/decline", { fromUserId }, { withCredentials: true });
      toast.success(res.data.msg);
      await fetchReceivedRequests(); // cập nhật lại
    } catch (err) {
      toast.error(err.response?.data?.msg || "Lỗi khi từ chối lời mời");
    }
  };


  const checkFriendStatus = (userId) => {
    if (friends.some((f) => f._id === userId)) return "friend";
    if (sentRequests.some((u) => u._id === userId)) return "sent";
    return "none";
  };

  return (
    <div className="container p-3 bg-white scroll-on-hover">
      <div className="row">
        <NavbarFriends />
        <div className="col">
          {/* Danh sách gợi ý kết bạn */}
          <div className="row bg-white p-2 border border-2 rounded-2">
            <h4 className="text-black text-center p-2">People you may know</h4>
            <ul className="list-unstyled d-flex flex-wrap justify-content-start">
              {users.length > 0 ? (
                users
                  .filter((user) => user._id !== currentUserId)
                  .map((user) => {
                    const status = checkFriendStatus(user._id);
                    return (
                      <li
                        key={user._id}
                        className="mb-3 p-4 border border-1 rounded-2 mx-2"
                        style={{ width: "280px" }}
                      >
                        <div className="d-flex align-items-center">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="border border-2 me-2"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "50%",
                            }}
                          />
                          <div>
                            <strong>{user.name}</strong>
                            <div className="text-muted">
                              {user.bio || "Chưa có mô tả"}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-center">
                          {status === "friend" ? (
                            <Button variant="secondary" disabled>
                              Bạn bè
                            </Button>
                          ) : status === "sent" ? (
                            <Button
                              variant="danger"
                              onClick={() => handleCancelRequest(user._id)}
                            >
                              Hủy lời mời
                            </Button>
                          ) : (
                            <Button
                              variant="outline-primary"
                              onClick={() => handleSendRequest(user._id)}
                            >
                              Kết bạn
                            </Button>
                          )}
                        </div>
                      </li>
                    );
                  })
              ) : (
                <p className="text-center">Chưa có người dùng nào.</p>
              )}
            </ul>
          </div>

          {/* Danh sách lời mời kết bạn */}
          {receivedRequests.length > 0 ? (
            receivedRequests.map((user) => (
              <li key={user._id} className="mb-3 p-3 border-bottom">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="rounded-circle border border-2 me-2"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                    <div>
                      <strong>{user.name}</strong>
                      <div className="text-muted">
                        {user.bio || "Chưa có mô tả"}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleAccept(user._id)}
                    >
                      Chấp nhận
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDecline(user._id)}
                    >
                      Từ chối
                    </Button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center">Chưa có lời mời kết bạn nào.</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default Friends;
