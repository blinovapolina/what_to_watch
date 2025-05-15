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
        setIsLoggedIn(true);
        setUserInfo({
          username: data.username,
          email: data.email,
          name: data.name || data.first_name,
          surname: data.surname || data.last_name,
        });
      } catch (err) {
        console.error(err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setIsLoggedIn(false);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setUserInfo(user);
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <BrowserRouter>
      <div className="App" style={{ margin: "-8px", overflow: "hidden" }}>
        <Routes>
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
          <Route
            path="/"
            element={<Registration onLoginSuccess={handleLoginSuccess} />}
          />
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
