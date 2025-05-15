import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Home } from "./pages/home/home";
import { Registration } from "./pages/registration/registration";
import { Selected } from "./pages/selected/selected";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Не удалось получить профиль");

        const data = await res.json();
        const user = {
          username: data.username,
          email: data.email,
          name: data.name || data.first_name,
          surname: data.surname || data.last_name,
        };

        setIsLoggedIn(true);
        setUserInfo(user);

        localStorage.setItem("username", user.username);
        localStorage.setItem("email", user.email);
        localStorage.setItem("name", user.name);
        localStorage.setItem("surname", user.surname);
      } catch (err) {
        console.error("Ошибка получения профиля:", err);
        clearStorage();
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setUserInfo(user);

    localStorage.setItem("username", user.username);
    localStorage.setItem("email", user.email);
    localStorage.setItem("name", user.name);
    localStorage.setItem("surname", user.surname);
  };

  const clearStorage = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("surname");

    setIsLoggedIn(false);
    setUserInfo(null);
  };

  if (loading) return <div className="spinner">Загрузка...</div>;

  return (
    <BrowserRouter>
      <div className="App" style={{ margin: "-8px", overflow: "hidden" }}>
        <Routes>
          <Route
            path="/"
            element={<Registration onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/account"
            element={
              isLoggedIn ? (
                <Home
                  openProfileModal={openProfileModal}
                  setOpenProfileModal={setOpenProfileModal}
                  userInfo={userInfo}
                  setIsLoggedIn={setIsLoggedIn}
                  setUserInfo={setUserInfo}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/selected"
            element={
              isLoggedIn ? (
                <Selected
                  openProfileModal={openProfileModal}
                  setOpenProfileModal={setOpenProfileModal}
                  userInfo={userInfo}
                  setIsLoggedIn={setIsLoggedIn}
                  setUserInfo={setUserInfo}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
