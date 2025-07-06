import React, { useState } from "react";
import NavbarLeftGamesPage from "./NavbarLeftGames";

const GamesPage = () => {
  const [showMenu, setShowMenu] = useState(false);

  const gamesWeLove = [
    { title: "Triple Match Master", players: "116K players", image: "/Images/Post/430910208_870250224856199_8935727036444960107_n.jpg" },
    { title: "Western Solitaire", players: "18K players", image: "/Images/Post/492353360_1394265825361995_1955014712250337089_n.jpg" },
    { title: "DesignVille: Merge &...", players: "124K players", image: "/Images/Post/515506940_1793556621544865_8760328619589088710_n.jpg" },
    { title: "Farm Rescue Match-3", players: "47K players", image: "/Images/Post/475521273_1754711401771808_4942753924377774071_n.jpg" },
  ];

  const happeningNow = [
    {
      game: "Solitaire Farm Seasons",
      event: "Fourth of July Celebration!",
      endsIn: "ENDS IN 4 DAYS",
      image: "/Images/Post/An-0gYqqIJL-vZtTrbj9LGyTGG2xaAoZYKf5bWNlYOOdLLrnv7kme7p5dLdDntGj_jn3G84G21OmMMklGGyqnRplPSlrm11-ldes_oN-bCGLzocDdvCOpKBtvfqeEWUw-mukKw.png",
    },
    {
      game: "Solitaire Home Story",
      event: "Fairytale Season!",
      endsIn: "ENDS IN 10 DAYS",
      image: "/Images/Post/An_ywndnOdQ9wgd8Yi3R3tKNw6Qxcs-7SPOf5mk_3M0ncsz8eprh6_LGTcsTLoZ8wMH-Y6bM-UW2b5xrZHaCJBM5FQasFrY9jzbmGksJ0exyXA5w71SRhK-5mSPAj9AZS_jfyA.png",
    },
    {
      game: "Tropical Merge",
      event: "🎆 July 4 Celebration",
      endsIn: "ENDS IN ABOUT A DAY",
      image: "/Images/Post/An8TZ2zQ54WGvNhyiLDQEjGtVLWWquuc4P8_B-i9XTimakn5bjgM-PVtYcqaJhmcEyDJqQFq0haR48b_1TnAY1xeWqTOKoGNGgdAlyevtk0SmbUry8FGCrs2Fnx2MG-P8Pn4.jpg",
    },
  ];

  return (
    <div className="container-fluid mt-2">
      <div className="row">
        {/* Nút menu cho màn hình nhỏ */}
        <div className="col-12 d-md-none mb-2">
          <button
            className="btn btn-outline-dark"
            onClick={() => setShowMenu(!showMenu)}
          >
            ☰ Menu
          </button>
        </div>

        {/* Sidebar trò chơi */}
        <div className={`col-12 col-md-3 ${showMenu ? "d-block" : "d-none"} d-md-block`}>
          <NavbarLeftGamesPage />
        </div>

        {/* Nội dung chính */}
        <div className="col-12 col-md-9">
          <div className="bg-white p-4 rounded shadow" style={{ minHeight: "80vh" }}>
            <h4 className="mb-4">🎮 Welcome to Games</h4>

            {/* Games we love */}
            <h5 className="fw-bold mb-3">Games we love</h5>
            <div className="d-flex gap-3 overflow-auto mb-4 pb-2">
              {gamesWeLove.map((game, index) => (
                <div
                  className="card text-white position-relative shadow-sm border-0"
                  key={index}
                  style={{ width: "220px", borderRadius: "15px", overflow: "hidden" }}
                >
                  <img
                    src={game.image}
                    className="card-img"
                    alt={game.title}
                    style={{ height: "130px", objectFit: "cover" }}
                  />
                  <div className="card-img-overlay d-flex flex-column justify-content-end bg-gradient">
                    <h6 className="fw-bold mb-1 text-truncate">{game.title}</h6>
                    <span className="badge bg-dark bg-opacity-75">{game.players}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Happening now */}
            <h5 className="fw-bold mb-3">Happening now</h5>
            <div className="row">
              {happeningNow.map((event, index) => (
                <div className="col-12 col-md-4 mb-4" key={index}>
                  <div className="card h-100 shadow-sm border-0">
                    <img
                      src={event.image}
                      className="card-img-top"
                      alt={event.game}
                      style={{ height: "140px", objectFit: "cover", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}
                    />
                    <div className="card-body">
                      <h6 className="card-title fw-bold">{event.game}</h6>
                      <p className="mb-1 text-muted small">{event.endsIn}</p>
                      <p className="card-text">{event.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesPage;
