import React, { useContext, useEffect, useState } from 'react';
import { Offcanvas, Form, FormControl, Button, ListGroup, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { AuthContext } from '../../../context/AuthContext';

const Message = ({ show, onClose }) => {
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const navigate = useNavigate();

  const { authState } = useContext(AuthContext);
  const userId = authState?._id;


  useEffect(() => {
    if (!userId) return;

    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      query: { userId },
    });


    newSocket.on("getOnlineUsers", (onlineUserIds) => {
      console.log("Danh sách user online:", onlineUserIds);
      setOnlineUsers(onlineUserIds);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [userId]);


  useEffect(() => {
    if (show) {
      fetchFriends();
    }
  }, [show]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${address}/api/friends/list`, { withCredentials: true });
      setFriends(res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bạn bè:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <Offcanvas show={show} onHide={onClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Tin nhắn</Offcanvas.Title>
        <Button
          variant="outline-primary ms-auto"
          size="sm"
          onClick={() => navigate("/messageall")}
        >
          See all
        </Button>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <Form className="d-flex justify-content-center mb-3">
          <FormControl
            type="search"
            placeholder="Tìm kiếm bạn bè..."
            className="me-2 w-75"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="outline-dark" type="button">
            <FontAwesomeIcon icon={faSearch} />
          </Button>
        </Form>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <ListGroup>
            {filteredFriends.length > 0 ? (
              filteredFriends.map(friend => (
                <ListGroup.Item
                  action
                  key={friend._id}
                  onClick={() => navigate(`/messageall/${friend._id}`)}
                  className="d-flex align-items-center justify-content-between"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="rounded-circle me-2"
                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    />
                    <div>
                      <strong>{friend.name}</strong>
                      <br />
                      <small className="text-muted">{friend.bio || "Chưa có mô tả"}</small>
                    </div>
                  </div>
                  <small
                    className={`badge ${onlineUsers.includes(friend._id) ? "bg-success" : "bg-secondary"
                      }`}
                  >
                    {onlineUsers.includes(friend._id) ? "Online" : "Offline"}
                  </small>
                </ListGroup.Item>
              ))
            ) : (
              <div className="text-center text-muted">Không có bạn bè nào</div>
            )}
          </ListGroup>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Message;
