import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faSearch,
  faRectangleList,
  faPeopleGroup,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const NavbarLeftGroupPage = () => {
  return (
    <div className="bg-white p-3 border border-1 rounded-2 min-vh-100 shadow w-100">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between">
        <h4 className="mb-0">Groups</h4>
        <button className="btn btn-outline-dark">
          <FontAwesomeIcon icon={faGear} />
        </button>
      </div>

      {/* Search */}
      <div className="d-flex mt-3">
        <button className="btn btn-outline-dark" type="submit">
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <input
          type="search"
          className="form-control rounded-5 ms-2"
          placeholder="Search groups..."
        />
      </div>

      {/* Menu Options */}
      <div className="mt-3 p-3">
        <ul className="navbar-nav flex-column">
          <li className="nav-item p-2">
            <button className="btn btn-outline-dark border-0 w-100 text-start">
              <FontAwesomeIcon icon={faRectangleList} className="me-2" />
              Your feed
            </button>
          </li>
          <li className="nav-item p-2">
            <button className="btn btn-outline-dark border-0 w-100 text-start">
              <FontAwesomeIcon icon={faPeopleGroup} className="me-2" />
              Your groups
            </button>
          </li>
        </ul>

        <div className="row mt-3">
          <button className="btn btn-outline-info">
            <FontAwesomeIcon icon={faPlus} /> Create your group
          </button>
        </div>

        <hr />
      </div>

      {/* Groups joined section */}
      <div className="d-flex align-items-center">
        <h5 className="mb-0">Groups you've joined</h5>
        <a href="#" className="text-decoration-none ms-auto fs-6">
          See all
        </a>
      </div>

      {/* Placeholder for joined groups */}
      <div className="scroll-on-hover mt-3" style={{ maxHeight: "250px", overflowY: "auto" }}>
        {/* Future group items here */}
        <div className="text-muted fst-italic text-center mt-2">No groups yet</div>
      </div>
    </div>
  );
};

export default NavbarLeftGroupPage;
