import React, { useState } from "react";
import NavbarLeftMarketPage from "./NavbarLeftMarket";

const productItems = [
  {
    name: "Ốp lưng Magsafe iPhone 15 Pro",
    image: "/Images/Post/op-lung-magsafe-iphone-15-pro-silicone-apple-mt1e3-thumbnew-600x600.jpg",
    price: 250000,
  },
  {
    name: "Oppo Reno13 Blue",
    image: "/Images/Post/oppo-reno13-blue-thumbnew-600x600.jpg",
    price: 7490000,
  },
  {
    name: "Pin sạc 10000mAh",
    image: "/Images/Post/pin-sac-du-phong-polymer-10000mah-ava-ds808a-thumb-1-638705446773748859-600x600.jpg",
    price: 390000,
  },
  {
    name: "Laptop",
    image: "/Images/Post/top-5-laptop-danh-cho-hoc-sinh-cap-3-ban-chay-nhat-4-2022-tai-TGDD-thumb--1--560x292.jpg",
    price: 590000,
  },
  {
    name: "Intel core i5",
    image: "/Images/Post/th (11).jpg",
    price: 120000,
  },
  {
    name: "Tai nghe Bluetooth",
    image: "/Images/Post/tai-nghe-bluetooth-true-wireless-oppo-enco-buds-3-pro-etek1-030325-031613-396-600x600.jpg",
    price: 2150000,
  },
];

const formatPrice = (price) => price.toLocaleString("vi-VN") + " đ";

const MarketplacePage = () => {
  const [showAll, setShowAll] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const displayedProducts = showAll ? productItems : productItems.slice(0, 3);

  return (
    <div className="container mt-3">
      <div className="row">

        
        <div className="col-12 d-md-none mb-2">
          <button className="btn btn-outline-secondary" onClick={() => setShowMenu(!showMenu)}>
            ☰ Menu
          </button>
        </div>

     
        <div className={`col-auto ${showMenu ? "d-block" : "d-none"} d-md-block`}>
          <NavbarLeftMarketPage />
        </div>
 
        <div className="col scroll-on-hover" style={{height:'80vh'}}>
          <h4 className="mb-4">🛍️ Sản phẩm nổi bật</h4>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {displayedProducts.map((item, index) => (
              <div key={index} className="col">
                <div className="card h-100 shadow-sm">
                  <img
                    src={item.image}
                    className="card-img-top"
                    alt={item.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title">{item.name}</h6>
                    <p className="card-text text-danger fw-bold">{formatPrice(item.price)}</p>
                    <button className="btn btn-primary mt-auto">Mua hàng</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 🔽 Nút xem thêm */}
          {!showAll && (
            <div className="text-center mt-4">
              <button className="btn btn-outline-primary" onClick={() => setShowAll(true)}>
                Xem thêm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
