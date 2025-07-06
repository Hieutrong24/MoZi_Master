import React from "react";
import { AuthContext } from "../../context/AuthContext";

const NavbarLeftMarketPage = () => {
  return (
    <div
      className="p-3 border border-1 rounded-2 shadow bg-light"
      style={{ minWidth: "250px", minHeight: "100vh" }} // 👈 giữ kích thước ổn định
    >
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between">
        <h4 className="mb-0">Marketplace</h4>
        <a href="#">
          <button className="btn btn-outline-dark">
            <i className="fa-solid fa-gear"></i>
          </button>
        </a>
      </div>

      {/* Search box */}
      <div className="d-flex mt-3">
        <button className="btn btn-outline-dark" type="submit">
          <i className="fas fa-search"></i>
        </button>
        <input
          type="search"
          className="form-control ms-2 rounded-5"
          placeholder="Search markets..."
        />
      </div>

      {/* Navigation menu */}
      <ul className="navbar-nav flex-column mt-4">
        <li className="nav-item mb-2">
          <a href="#" className="btn btn-outline-dark w-100 text-start">
            <i className="fas fa-home me-2"></i>Home
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="#" className="btn btn-outline-dark w-100 text-start">
            <i className="fa-solid fa-car me-2"></i>Cars
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="#" className="btn btn-outline-dark w-100 text-start">
            <i className="fa-solid fa-phone me-2"></i>Smartphone
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="#" className="btn btn-outline-dark w-100 text-start">
            <i className="fa-solid fa-desktop me-2"></i>Computers
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="#" className="btn btn-outline-dark w-100 text-start">
            <i className="fa-solid fa-chair me-2"></i>Office chair
          </a>
        </li>
      </ul>
    </div>
  );
};

export default NavbarLeftMarketPage;
