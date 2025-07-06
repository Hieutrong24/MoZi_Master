import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const NavbarFriends = () => {
  const { authState } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const address = "http://localhost:3000";

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get(`${address}/api/friends/list`, {
          withCredentials: true,
        });
        setFriends(res.data.data || []);
      } catch (err) {
        console.error("Lỗi lấy danh sách bạn bè:", err);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="col-lg-3 col-md-4 col-12 mb-3">
      <div className="bg-white p-3 border rounded-3 shadow-sm min-vh-100">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="fw-bold">Bạn bè</h5>
          <button className="btn btn-light">
            <i className="fa-solid fa-gear"></i>
          </button>
        </div>

        {/* Search */}
        <div className="d-flex mt-3 gap-2">
          <input
            type="search"
            className="form-control rounded-pill"
            placeholder="Tìm kiếm bạn bè..."
          />
          <button className="btn btn-dark rounded-pill">
            <i className="fas fa-search"></i>
          </button>
        </div>

        {/* Navigation Menu */}
        <ul className="nav flex-column mt-4">
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-dark d-flex align-items-center gap-2">
              <i className="fa-solid fa-user-group text-primary"></i>
              Trang chủ bạn bè
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-dark d-flex align-items-center gap-2">
              <i className="fa-solid fa-user-plus text-success"></i>
              Lời mời kết bạn
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-dark d-flex align-items-center gap-2">
              <i className="fa-solid fa-users text-info"></i>
              Gợi ý kết bạn
            </a>
          </li>
        </ul>

        <hr />

        {/* Friends List */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-bold mb-0">Bạn bè của bạn</h6>
          <a href="#" className="small text-decoration-none">Xem tất cả</a>
        </div>

        <div className="scroll-on-hover overflow-auto" style={{ maxHeight: "50vh" }}>
          {friends.length > 0 ? (
            friends.map((friend) => (
              <Link
                to={`/profile/${friend._id}`}
                key={friend._id}
                className="d-flex align-items-center mb-3 text-decoration-none text-dark"
              >
                <img
                  src={friend.avatar || "/Images/Avarta/default.jpg"}
                  alt="avatar"
                  className="rounded-circle me-3"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <span className="fw-medium">{friend.name}</span>
              </Link>
            ))
          ) : (
            <div className="text-muted text-center">Chưa có bạn bè.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarFriends;
