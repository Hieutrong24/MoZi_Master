import React, { useState } from "react";
import NavbarLeftGroupPage from "./NavbarLeftGroup";

const GroupPage = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="container-fluid mt-2">
      <div className="row">
        {/* Nút menu cho mobile */}
        <div className="col-12 d-md-none mb-2">
          <button
            className="btn btn-outline-dark"
            onClick={() => setShowMenu(!showMenu)}
          >
            ☰ Menu
          </button>
        </div>

        {/* Sidebar nhóm - hiện hoặc ẩn tùy thuộc vào trạng thái */}
        <div className={`col-12 col-md-3 ${showMenu ? "d-block" : "d-none"} d-md-block`}>
          <div className="h-100">
            <NavbarLeftGroupPage />
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="col-12 col-md-9">
          <div
            className="bg-body-secondary p-4 rounded shadow"
            style={{ minHeight: "80vh" }}
          >
            <h4 className="mb-4">Welcome to Groups</h4>
            <p>Trang nhóm với nội dung chính tại đây...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
