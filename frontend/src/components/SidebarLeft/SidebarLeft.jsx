import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUser, faGlobe, faCalendarDays, faComments, faBell, faGear } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SidebarLeft = () => {
  const { authState } = useContext(AuthContext); 
  const { name, avatar } = authState || {};
  const navigate = useNavigate();

  const userName = name || "Tên người dùng";
  const userCoverImage = authState.user?.coverImage || './Images/AnhBia/bai-hat-ve-hoa-anh-dao-nhat-ban_113553327.jpg';
  const userAvatar = avatar || './Images/Avarta/th (1).jpg';  
  const userBio = authState.user?.bio || "Chưa có mô tả"; 

  const postsCount = 256;
  const followersCount = "2.5K";
  const followingCount = 365;

  return (
    <div className="col-lg-3 rounded-2 d-none d-lg-block">
      <div className="scroll-on-hover" style={{ height: '608px' }}>
        <div className="bg-white rounded shadow position-relative pb-4">
          <div className="overflow-hidden rounded-top" style={{ height: '80px' }}>
            <img src={userCoverImage} className="img-fluid w-100" alt="Ảnh bìa người dùng" />
          </div>
          <img
            src={userAvatar}
            className="rounded-circle border border-4 border-white position-absolute top-88 start-50 translate-middle"
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
            alt="Ảnh đại diện"
          />
          <div className="mt-5 text-center fw-bold">{userName}</div>
          <div className="text-center text-muted px-2" style={{ fontSize: '14px' }}>
            {userBio}
          </div>

          <div className="container">
            <div className="row row-cols-3 text-center p-2">
              <div className="border">
                {postsCount}
                <br />
                Post
              </div>
              <div className="border">
                {followersCount}
                <br />
                Followers
              </div>
              <div className="border">
                {followingCount}
                <br />
                Following
              </div>
            </div>
          </div>

          <hr className="bg-dark" />

          <div className="container">
            <ul className="list-unstyled">
              <li className="p-2 btn text-start w-100" onClick={() => navigate("/home")}>
                <FontAwesomeIcon icon={faHouse} className="me-2" /> Feed
              </li>
              <li className="p-2 btn text-start w-100" onClick={() => navigate("/friends")}>
                <FontAwesomeIcon icon={faUser} className="me-2" /> Connections
              </li>
              <li className="p-2 btn text-start w-100" onClick={() => navigate("/news")}>
                <FontAwesomeIcon icon={faGlobe} className="me-2" /> Latest News
              </li>
              <li className="p-2 btn text-start w-100" onClick={() => navigate("/events")}>
                <FontAwesomeIcon icon={faCalendarDays} className="me-2" /> Events
              </li>
              <li className="p-2 btn text-start w-100" onClick={() => navigate("/groups")}>
                <FontAwesomeIcon icon={faComments} className="me-2" /> Groups
              </li>
              <li className="p-2 btn text-start w-100" onClick={() => navigate("/notifications")}>
                <FontAwesomeIcon icon={faBell} className="me-2" /> Notifications
              </li>
              <li className="p-2 btn text-start w-100" onClick={() => navigate("/settings")}>
                <FontAwesomeIcon icon={faGear} className="me-2" /> Settings
              </li>
            </ul>
          </div>

          <hr className="bg-dark" />

          <div className="text-center pb-3">
            <button className="btn btn-outline-primary w-75" onClick={() => navigate("/viewprofile")}>
              View profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;
