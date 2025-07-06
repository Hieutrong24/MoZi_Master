// frontend/src/components/Sidebar/WhoToFollow.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const WhoToFollow = () => {
  // Dữ liệu giả định
  const suggestedUsers = [
    { id: 1, name: "Judy Nguyen", avatar: './Images/Avarta/th (1).jpg' },
    { id: 2, name: "Alice Smith", avatar: './Images/Avarta/th (1).jpg' },
    { id: 3, name: "Bob Johnson", avatar: './Images/Avarta/th (1).jpg' },
    { id: 4, name: "Charlie Brown", avatar: './Images/Avarta/th (1).jpg' },
  ];

  return (
    <div className="col-lg-3 d-none d-lg-block p-0">
      <div className="scroll-on-hover vh-100 overflow-hidden">
        <div className="border border-2 rounded-3 shadow p-3 bg-white p-2">
          <h5 className="text-center">Who to follow</h5>
          <ul className="navbar-nav flex-column p-3">
            {suggestedUsers.map(user => (
              <li className="nav-item mb-3" key={user.id}>
                <a href="#" className="text-decoration-none text-dark"> {/* Thêm text-dark để giữ màu chữ */}
                  <div className="row row-cols-3 align-items-center"> {/* Thêm align-items-center */}
                    <div className="col-2">
                      <img src={user.avatar}
                        className="rounded-circle border border-2"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        alt="User Avatar" />
                    </div>
                    <div className="col-6"> <strong>{user.name}</strong></div>
                    <div className="col-2 ms-auto">
                      <button className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}> {/* Điều chỉnh kích thước button */}
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                </a>
              </li>
            ))}
            <li>
              <div className="row">
                <a href="#" className="btn btn-outline-info text-decoration-none">View more</a>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-1 shadow rounded-2 mt-3 p-3">
          <h5 className="text-center">Today's new</h5>
          <hr className="bg-dark" />
          {/* Nội dung "Today's new" sẽ được thêm vào đây */}
        </div>
      </div>
    </div>
  );
};

export default WhoToFollow;