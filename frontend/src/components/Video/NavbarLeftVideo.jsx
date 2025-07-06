import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGear,
  faSearch,
  faHome,
  faVideo,
  faBookmark,
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const NavbarleftVideo = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white p-3 border border-1 rounded-2 min-vh-100 shadow w-100">
      {/* Tiêu đề + Cài đặt */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">🎬 Video</h4>
        <button className="btn btn-outline-dark">
          <FontAwesomeIcon icon={faGear} />
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="input-group mb-3">
        <span className="input-group-text bg-white border-end-0">
          <FontAwesomeIcon icon={faSearch} />
        </span>
        <input
          type="search"
          className="form-control border-start-0"
          placeholder="Tìm video..."
        />
      </div>

      {/* Danh mục */}
      <ul className="nav flex-column mt-4">
        <li className="nav-item mb-2">
          <button
            onClick={() => navigate('/video')}
            className={`btn w-100 text-start ${
              isActive('/video') ? 'btn-dark text-white' : 'btn-outline-dark'
            }`}
          >
            <FontAwesomeIcon icon={faHome} className="me-2" />
            Trang chủ video
          </button>
        </li>
        <li className="nav-item mb-2">
          <button
            onClick={() => navigate('/video/live')}
            className={`btn w-100 text-start ${
              isActive('/video/live') ? 'btn-dark text-white' : 'btn-outline-dark'
            }`}
          >
            <FontAwesomeIcon icon={faVideo} className="me-2" />
            Trực tiếp
          </button>
        </li>
        <li className="nav-item mb-2">
          <button
            onClick={() => navigate('/video/saved')}
            className={`btn w-100 text-start ${
              isActive('/video/saved') ? 'btn-dark text-white' : 'btn-outline-dark'
            }`}
          >
            <FontAwesomeIcon icon={faBookmark} className="me-2" />
            Đã lưu
          </button>
        </li>
      </ul>
    </div>
  );
};

export default NavbarleftVideo;
