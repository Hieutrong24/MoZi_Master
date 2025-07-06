import React from "react";

const NavbarLeftGamesPage = () => {
  return (
    <div className="bg-white p-3 border border-1 rounded-2 shadow w-100 h-100">
      <div className="d-flex align-items-center justify-content-between">
        <h4 className="mb-0">Games</h4>
        <a href="#">
          <button className="btn btn-outline-dark">
            <i className="fa-solid fa-gear"></i>
          </button>
        </a>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="d-flex mt-3">
        <button className="btn btn-outline-dark" type="submit">
          <i className="fas fa-search"></i>
        </button>
        <input
          type="search"
          className="form-control rounded-5 ms-2"
          placeholder="Search games..."
        />
      </div>

      {/* Menu sidebar */}
      <div className="mt-3">
        <ul className="navbar-nav flex-column">
          <li className="nav-item p-2">
            <button className="btn btn-outline-dark border-0 w-100 text-start">
              <i className="fa-solid fa-gamepad me-2"></i> Play game
            </button>
          </li>
          <li className="nav-item p-2">
            <button className="btn btn-outline-dark border-0 w-100 text-start">
              <i className="fa-solid fa-bell me-2"></i> Notifications
            </button>
          </li>
        </ul>
      </div>

      <hr />

      {/* Your games section */}
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="mb-0">Your games</h5>
        <a href="#" className="text-decoration-none">
          See all
        </a>
      </div>

      <div className="scroll-on-hover mt-3">
        {/* Danh sách game sẽ hiển thị ở đây */}
      </div>
    </div>
  );
};

export default NavbarLeftGamesPage;
