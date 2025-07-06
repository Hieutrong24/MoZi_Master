import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "react-bootstrap";

const UserProfilePage = () => {
  const { userId } = useParams();
  const address = "http://localhost:3000";
  const { authState } = useContext(AuthContext);
  const currentUserId = authState?._id;

  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${address}/api/user/${userId}`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Lỗi lấy thông tin người dùng:", err);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(`${address}/api/posts/user/${userId}`, {
          withCredentials: true,
        });
        setUserPosts(res.data.posts || []);
      } catch (err) {
        console.error("Lỗi lấy bài viết người dùng:", err);
      }
    };

    const fetchFriends = async () => {
      try {
        const res = await axios.get(`${address}/api/friends/list/${userId}`, {
          withCredentials: true,
        });
        setFriends(res.data.data || []);
        if (currentUserId) {
          const found = res.data.data.some(friend => friend._id === currentUserId);
          setIsFriend(found);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách bạn bè:", err);
      }
    };

    const checkFriendRequest = async () => {
      try {
        const res = await axios.get(`${address}/api/friends/request-status/${userId}`, {
          withCredentials: true,
        });
        setIsRequested(res.data.requested);
      } catch (err) {
        console.error("Lỗi kiểm tra lời mời kết bạn:", err);
      }
    };

    fetchUser();
    fetchUserPosts();
    fetchFriends();
    checkFriendRequest();
  }, [userId, currentUserId]);

  const handleSendFriendRequest = async () => {
    try {
      await axios.post(`${address}/api/friends/request`, { receiverId: userId }, {
        withCredentials: true,
      });
      setIsRequested(true);
    } catch (err) {
      console.error("Gửi lời mời kết bạn thất bại:", err);
    }
  };

  return (
    <div className="container bg-body-secondary mt-3">
      <div className="row">
        {/* Cột trái - Thông tin người dùng và bài viết */}
        <div className="col-12 col-lg-8 scroll-on-hover" style={{ height: '75vh' }}>
          <div className="bg-white border border-2 rounded-3 p-2 position-relative">
            <img
              src="/Images/AnhBia/bai-hat-ve-hoa-anh-dao-nhat-ban_113553327.jpg"
              className="img img-fluid"
              style={{ height: '200px', width: '100%', objectFit: 'cover' }}
              alt="cover"
            />

            <div className="d-flex align-items-center position-absolute" style={{ top: '170px', left: '30px' }}>
              <img
                src={user.avatar || "/Images/Avarta/default.jpg"}
                alt="avatar"
                className="rounded-circle border border-4 border-white"
                style={{ height: '100px', width: '100px', objectFit: 'cover' }}
              />
              <div className="ms-3 mt-5">
                <h4 className="mb-0">{user.name}</h4>
                <p className="text-muted">{friends.length} bạn bè</p>
              </div>
            </div>

            <div className="position-absolute custom-mt" style={{ top: '20px', right: '20px' }}>
              {currentUserId !== userId && (
                isFriend ? (
                  <Button variant="success" disabled>Đã là bạn bè</Button>
                ) : isRequested ? (
                  <Button variant="warning" disabled>Đã gửi lời mời</Button>
                ) : (
                  <Button variant="primary" onClick={handleSendFriendRequest}>Kết bạn</Button>
                )
              )}
              <Button variant="primary" className="ms-2">Nhắn tin</Button>
            </div>
          </div>

          {/* About section */}
          <div className="bg-white p-4 rounded-lg shadow mb-4" style={{ marginTop: '4rem' }}>
            <h5 className="mb-3" style={{ fontWeight: 'bold' }}>About</h5>
            <p className="text-muted mb-4">
              He moonlights difficult engrossed it, sportsmen. Interested has all Devonshire
              difficulty gay assistance joy.
            </p>
            <div className="d-flex align-items-center mb-2">
              <i className="fa-solid fa-calendar-days me-3" style={{ color: '#6c757d' }}></i>
              <span className="text-dark">Born: <span style={{ fontWeight: 'bold' }}>October 20, 1990</span></span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <i className="fa-solid fa-heart me-3" style={{ color: '#6c757d' }}></i>
              <span className="text-dark">Status: <span style={{ fontWeight: 'bold' }}>Single</span></span>
            </div>
            <div className="d-flex align-items-center mb-0">
              <i className="fa-solid fa-envelope me-3" style={{ color: '#6c757d' }}></i>
              <span className="text-dark">Email: <span style={{ fontWeight: 'bold' }}>example@gmail.com</span></span>
            </div>
          </div>

          {/* Danh sách bài viết */}
          <div className="mt-2">
            {userPosts.length === 0 ? (
              <div className="text-muted text-center mt-4">Người dùng này chưa có bài viết nào.</div>
            ) : (
              userPosts.map((post) => (
                <div key={post._id} className="bg-white p-4 rounded-lg shadow mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={user.avatar || "/Images/Avarta/default.jpg"}
                      className="rounded-circle me-3"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      alt="User Avatar"
                    />
                    <div>
                      <h6 className="mb-0">{user.name}</h6>
                      <small className="text-muted">{new Date(post.createdAt).toLocaleString()}</small>
                    </div>
                  </div>

                  <p>{post.content}</p>

                  {/* Hiển thị hình ảnh nếu có */}
                  {post.image && (
                    <div className="text-center">
                      <img
                        src={`${address}${post.image}`}
                        className="img-fluid rounded mb-3"
                        alt="Post"
                      />
                    </div>
                  )}

                  {/* Hiển thị video nếu có */}
                  {post.video && (
                    <div className="mb-3">
                      <div className="ratio ratio-16x9">
                        <video controls>
                          <source src={`${address}${post.video}`} type="video/mp4" />
                          Trình duyệt của bạn không hỗ trợ video.
                        </video>
                      </div>
                    </div>
                  )}

                  <div className="d-flex justify-content-between text-muted">
                    <span><i className="far fa-heart me-1"></i> {post.likes.length} Likes</span>
                    <span><i className="far fa-comment me-1"></i> {post.comments.length} Comments</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cột phải - danh sách bạn bè */}
        <div className="col-12 col-lg-4 mt-3 mt-lg-0 scroll-on-hover" style={{ height: '75vh' }}>
          <div className="bg-white rounded shadow p-3">
            <h5 className="mb-3">Bạn bè ({friends.length})</h5>
            <div className="row row-cols-2 g-2">
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <div key={friend._id} className="text-center">
                    <img
                      className="img-fluid rounded-circle mb-2"
                      src={friend.avatar || "/Images/Avarta/default.jpg"}
                      alt="avatar"
                      style={{ height: "70px", width: "70px", objectFit: "cover" }}
                    />
                    <p className="mb-0 small">{friend.name}</p>
                  </div>
                ))
              ) : (
                <div className="text-muted">Không có bạn bè.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
