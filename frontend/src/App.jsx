import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Home } from "./pages/home/home";
import { Registration } from "./pages/registration/registration";
import { Selected } from "./pages/selected/selected";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [openProfileModal, setOpenProfileModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setUserInfo({
        name: "Иван",
        surname: "Иванов",
        email: "ivanovivan@gmail.com",
        nick: "vanya",
      });
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setUserInfo(user);
  };

  return (
    <BrowserRouter>
      <div className="App" style={{ margin: "-8px", overflow: "hidden" }}>
        <Routes>
          {/* Главная страница — если не залогинен, редирект на / */}
          <Route
            path="/account"
            element={
              isLoggedIn ? (
                <Home
                  openProfileModal={openProfileModal}
                  setOpenProfileModal={setOpenProfileModal}
                  userInfo={userInfo}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Регистрация и логин */}
          <Route
            path="/"
            element={<Registration onLoginSuccess={handleLoginSuccess} />}
          />

          {/* Избранное — только если залогинен */}
          <Route
            path="/selected"
            element={
              isLoggedIn ? (
                <Selected
                  openProfileModal={openProfileModal}
                  setOpenProfileModal={setOpenProfileModal}
                  userInfo={userInfo}
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
