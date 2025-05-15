import { Link, useLocation, useNavigate } from "react-router-dom";
import "./profileModal.css";

export const ProfileModal = ({ setOpenProfileModal, name, surname, email, username, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("surname");

    if (typeof onLogout === "function") {
      onLogout();
    }

    setOpenProfileModal(false);
    navigate("/");
  };

  return (
    <div className="profileModal">
      <div className="titleProfileModal">Мой аккаунт</div>

      <div className="infoContainerProfileModaL">
        <div className="lineInfoProfileModal">Фамилия: {surname}</div>
        <div className="lineInfoProfileModal">Имя: {name}</div>
        <div className="lineInfoProfileModal">Email: {email}</div>
        <div className="lineInfoProfileModal">Логин: {username}</div>
      </div>

      {location.pathname !== "/selected" && (
        <Link to="/selected" style={{ textDecoration: "none" }} onClick={() => setOpenProfileModal(false)}>
          <div className="lineFavouriteProfileModal">
            Избранное
            <svg
              width="20"
              height="14"
              viewBox="0 0 20 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.43 0.929932L18.5 6.99993L12.43 13.0699M1.5 6.99993H18.33"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Link>
      )}

      <div className="logoutTextProfileModal" onClick={handleLogout}>
        Выйти из аккаунта
      </div>
    </div>
  );
};
