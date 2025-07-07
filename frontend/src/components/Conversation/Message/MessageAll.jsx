import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from "../../../context/AuthContext";
import { useSocketContext } from "../../../context/SocketContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import { faPhone, faVideo, faEllipsisV, faPaperPlane, faPen, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import '../style.css'; // Import your CSS file for styling
const MessageAllPage = () => {
  const { friendId } = useParams();
  const { authState } = useContext(AuthContext);
  const { socket, onlineUsers } = useSocketContext();
  const navigate = useNavigate();
  const address = "http://localhost:3000";

  const [friends, setFriends] = useState([]);
  const [currentFriend, setCurrentFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUserAvatar = authState?.avatar || "default-avatar.png";
  const currentUserName = authState?.name || "Bạn";
  const currentUserId = authState?._id;
  const messageEndRef = useRef(null);

  console.log('friends:', friends);
  console.log('authState:', authState);
  useEffect(() => {
    fetchFriends();
    if (friendId) {
      fetchFriendDetail(friendId);
      fetchMessages(friendId);
    }
  }, [friendId]);

  useEffect(() => {
    if (!socket || !authState?._id) return;

    const handleNewMessage = (newMsg) => {
      console.log('Nhận tin nhắn mới từ socket:', newMsg);
      // const senderId = typeof newMsg.senderId === 'object' ? newMsg.senderId._id : newMsg.senderId;
      // const receiverId = typeof newMsg.receiverId === 'object' ? newMsg.receiverId._id : newMsg.receiverId;

      // const isCurrentChat =
      //   (receiverId === currentUserId) ||
      //   (receiverId === friendId);

      // if (isCurrentChat) {

      // }

      setMessages((prev) => [...prev, newMsg]);
    };
    socket.on("getOnlineUsers", (onlineUserIds) => {
      console.log("Danh sách user online:", onlineUserIds);

    });
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("getOnlineUsers");
    };
  }, [socket, friendId, authState?._id]);

  useEffect(() => {
    if (socket && authState?._id) {
      socket.emit("join", authState._id);
      console.log(" Đã join socket với userId:", authState._id);
    }
  }, [socket, authState?._id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchFriends = async () => {
    try {
      const res = await axios.get(`${address}/api/friends/list`, { withCredentials: true });
      const friendsData = res.data.data || [];

      setFriends(friendsData.filter(fr => fr._id !== currentUserId));
    } catch (err) {
      console.error("Lỗi khi tải danh sách bạn bè:", err);
    }
  };

  const fetchFriendDetail = async (id) => {
    try {
      const res = await axios.get(`${address}/api/user/${id}`, { withCredentials: true });
      setCurrentFriend(res.data.user || null);
    } catch (err) {
      console.error("Không tìm thấy người dùng:", err);
    }
  };

  const fetchMessages = async (id) => {
    try {
      const res = await axios.get(`${address}/api/message/${id}`, { withCredentials: true });
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Không thể lấy tin nhắn:", err.response?.data || err.message);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !friendId) return;

    try {
      const res = await axios.post(`${address}/api/message/send/${friendId}`, {
        message: newMessage,
      }, {
        withCredentials: true,
      });


      const newSentMessage = {
        _id: res.data.messageId,
        message: newMessage,
        senderId: {
          _id: currentUserId,
          name: authState?.full_name || authState?.username || "Tôi",
          avatar: authState?.profile_picture || "/default-avatar.png"
        },
        receiverId: friendId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newSentMessage]);

      setNewMessage("");


    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err.response?.data || err.message);
    }
  };


  const isOnline = (userId) => onlineUsers.includes(userId);
  return (
    <div className="d-flex container mt-3 md:flex-col main" style={{ height: '80vh', background: '#f7f7f9' }}>
      {/* Nút mở offcanvas - chỉ hiện trên màn nhỏ */}
      <div className="d-block d-md-none p-2 bg-white border-bottom">
        <button
          className="btn btn-outline-primary"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasFriends"
          aria-controls="offcanvasFriends"
        >
          <i className="fas fa-bars"></i> Bạn bè
        </button>
      </div>

      {/* Offcanvas hiển thị danh sách bạn bè (chỉ màn nhỏ) */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasFriends"
        aria-labelledby="offcanvasFriendsLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasFriendsLabel">Danh sách bạn bè</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          {/* Nội dung sidebar thu gọn ở đây */}
          <div className="input-group mb-3">
            <input type="text" className="form-control rounded-5" placeholder="Search for chats" />
            <Button className="input-group-text bg-dark border-0">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </div>

          <div className="list-group border-0">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="list-group-item list-group-item-action d-flex align-items-center border-0"
                onClick={() => navigate(`/message/${friend._id}`)}
                style={{ cursor: "pointer" }}
                data-bs-dismiss="offcanvas" // Auto close on click
              >
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="rounded-circle me-3"
                  style={{ width: "45px", height: "45px", objectFit: "cover" }}
                />
                <div>
                  <div className="fw-bold">{friend.name}</div>

                  <div className="text-muted" style={{ fontSize: "0.9em" }}>
                    {friend.latestMessage?.text || "Chưa có tin nhắn"}
                    <br />
                    <small>
                      {friend.latestMessage?.time &&
                        new Date(friend.latestMessage.time).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </small>
                  </div>
                </div>
              </div>
            ))}
            {friends.length === 0 && (
              <div className="text-center text-muted mt-2">Chưa có bạn bè</div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar chính - hiện trên màn hình lớn */}
      <div className="col-3 border-end bg-white p-3 scroll-on-hover d-none d-md-block" style={{ height: '80vh' }}>
        <h5 className="fw-bold">Danh sách bạn bè <span className="badge bg-success ms-1">{friends.length}</span></h5>
        <div className="input-group mb-3">
          <input type="text" className="form-control rounded-5" placeholder="Search for chats" />
          <Button className="input-group-text bg-dark border-0">
            <FontAwesomeIcon icon={faSearch} />
          </Button>
        </div>

        <div className="list-group border-0">
          {friends.map((friend) => (
            <div
              key={friend._id}
              className="list-group-item list-group-item-action d-flex align-items-center border-0"
              onClick={() => navigate(`/message/${friend._id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={friend.avatar}
                alt={friend.name}
                className="rounded-circle me-3"
                style={{ width: "45px", height: "45px", objectFit: "cover" }}
              />
              <div>
                <div className='d-flex align-items-center'>
                  <div className="fw-bold me-2">{friend.name}</div>
                  <div className="ms-auto">
                    <span className={`badge rounded-pill ${isOnline(friend._id) ? 'bg-success' : 'bg-secondary'}`}>
                      {isOnline(friend._id) ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                <div className="text-muted" style={{ fontSize: "0.9em" }}>
                  {friend.latestMessage?.text || "Chưa có tin nhắn"}
                  <br />
                  <small>
                    {friend.latestMessage?.time &&
                      new Date(friend.latestMessage.time).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </small>
                </div>
              </div>
            </div>
          ))}
          {friends.length === 0 && (
            <div className="text-center text-muted mt-2">Chưa có bạn bè</div>
          )}
        </div>
      </div>


      {/* Main chat */}
      <div className="col-9 d-flex flex-column main-chat" style={{ height: '80vh' }}>
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between bg-white p-3 border-bottom">
          <div className="d-flex align-items-center">
            <img
              src={currentFriend?.avatar || currentUserAvatar}
              alt={currentFriend?.name || currentUserName}
              className="rounded-circle me-2"
              style={{ width: "45px", height: "45px" }}
            />
            <div>
              <div className="fw-bold">{currentFriend?.name || currentUserName}</div>
              <small className={currentFriend && isOnline(currentFriend._id) ? "text-success" : "text-muted"}>
                {currentFriend
                  ? isOnline(currentFriend._id) ? "Online" : "Offline"
                  : "Chưa chọn người chat"}
              </small>
            </div>

          </div>
          <div className="d-flex gap-3">
            <button className="btn btn-light"><FontAwesomeIcon icon={faPhone} /></button>
            <button className="btn btn-light"><FontAwesomeIcon icon={faVideo} /></button>
            <button className="btn btn-light"><FontAwesomeIcon icon={faEllipsisV} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-grow-1 p-4 overflow-auto bg-light rounded" style={{ position: "relative" }}>
          {messages.length === 0 ? (
            <div className="text-center text-muted small mb-3">Chưa có tin nhắn</div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.senderId?._id === currentUserId || msg.senderId === currentUserId;
              const isSenderObject = true;
              const avatarUrl = isMe ? currentUserAvatar : isSenderObject ? currentFriend?.avatar : "";
              const nameDisplay = isMe ? currentUserName : isSenderObject ? currentFriend?.name : "Người dùng";
              const time = msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : "";

              return (
                <div key={index} className={`d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'} mb-3`}>
                  {!isMe && (
                    <img
                      src={avatarUrl}
                      alt={nameDisplay}
                      className="rounded-circle me-2"
                      style={{ width: "35px", height: "35px", objectFit: "cover" }}
                    />
                  )}
                  <div>
                    <div className={`p-2 rounded-3 shadow-sm ${isMe ? 'bg-primary text-white' : 'bg-white text-dark'}`} style={{ maxWidth: "350px" }}>
                      <div className="small fw-bold mb-1">{nameDisplay}</div>
                      <div>{typeof msg.message === 'string' ? msg.message : '[Tin nhắn không hợp lệ]'}</div>

                      <div className="text-end small text-muted mt-1">{time}</div>
                    </div>
                  </div>
                  {isMe && (
                    <img
                      src={avatarUrl}
                      alt={nameDisplay}
                      className="rounded-circle ms-2"
                      style={{ width: "35px", height: "35px", objectFit: "cover" }}
                    />
                  )}
                </div>
              );
            })
          )}
          <div ref={messageEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-top d-flex align-items-center">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!currentFriend}
          />
          <button
            className="btn btn-primary"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !currentFriend}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageAllPage;
