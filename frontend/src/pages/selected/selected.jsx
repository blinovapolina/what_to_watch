import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../../components/header/header";
import { ProfileModal } from "../../components/profileModal/profileModal";
import "./selected.css";

export const Selected = ({ openProfileModal, setOpenProfileModal, userInfo }) => {
  const [favorites, setFavorites] = useState([]);
  const [openDescriptionId, setOpenDescriptionId] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/films/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Ошибка при загрузке избранного");

        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error("Ошибка при загрузке избранных фильмов:", error);
      }
    };

    fetchFavorites();
  }, []);

  const toggleDescription = (id) => {
    setOpenDescriptionId(openDescriptionId === id ? null : id);
  };

  return (
    <div className="selectedPage">
      <Header setOpenProfileModal={setOpenProfileModal} />
      <div className="selected">
        <Link to="/account" style={{ textDecoration: "none" }}>
          <div className="textMainSelected">
            <svg
              width="24"
              height="19"
              viewBox="0 0 24 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 9.49992H5M5 9.49992L12 15.0416M5 9.49992L12 3.95825"
                stroke="#9B9F9B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Главная
          </div>
        </Link>
        <div className="titleSelectedPage">Избранное</div>
        <div className="containerSelectedPage">
          <div className="containerScrollSelectedPage">
            {favorites.length === 0 ? (
              <div className="emptySelectedMessage">
                У вас пока нет избранных фильмов.
              </div>
            ) : (
              favorites.map((film) => (
                <div key={film.id} className="filmBlock">
                  <div className="filmHeaderRow">
                    <div className="leftTitleWrapper">
                      <div
                        className="leftLineSelectedPage"
                        onClick={() => toggleDescription(film.id)}
                        title="Показать описание"
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            transform: openDescriptionId === film.id ? "rotate(90deg)" : "rotate(0deg)",
                          }}
                        >
                          <path
                            d="M5.50317 8.24878L11.0016 13.7499L16.5026 8.2515"
                            stroke="#1E1E1E"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      <div className="nameFilmSelectedPage">
                        {film.title} {film.year ? `(${film.year})` : ""}
                      </div>
                    </div>

                    <div className="favoriteIcon" title="Избранное">
                      <svg
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.8401 4.63673C20.3294 4.12573 19.7229 3.72037 19.0555 3.44381C18.388 3.16725 17.6726 3.0249 16.9501 3.0249C16.2276 3.0249 15.5122 3.16725 14.8448 3.44381C14.1773 3.72037 13.5709 4.12573 13.0601 4.63673L12.0001 5.69673L10.9401 4.63673C9.90843 3.60504 8.50915 3.02544 7.05012 3.02544C5.59109 3.02544 4.19181 3.60504 3.16012 4.63673C2.12843 5.66842 1.54883 7.06769 1.54883 8.52673C1.54883 9.98576 2.12843 11.385 3.16012 12.4167L12.0001 21.2567L20.8401 12.4167C21.3511 11.906 21.7565 11.2995 22.033 10.6321C22.3096 9.96462 22.4519 9.24922 22.4519 8.52673C22.4519 7.80424 22.3096 7.08883 22.033 6.42137C21.7565 5.75391 21.3511 5.14748 20.8401 4.63673Z"
                          fill="#FF6D6D"
                          stroke="#FF6D6D"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {openDescriptionId === film.id && (
                    <div className="filmDescriptionWrapper">
                      <div className="filmDescription">
                        {film.description || "Описание отсутствует"}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {openProfileModal && (
        <div className="profileModalHomePage">
          <ProfileModal
            setOpenProfileModal={setOpenProfileModal}
            name={userInfo.name}
            surname={userInfo.surname}
            email={userInfo.email}
            username={userInfo.username}
          />
        </div>
      )}
    </div>
  );
};
