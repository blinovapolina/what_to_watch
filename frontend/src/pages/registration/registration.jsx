import { useState } from "react";
import { RegistrationModal } from "../../components/registrationModal/registrationModal";
import { getToken } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import "./registration.css";

export const Registration = ({ onLoginSuccess }) => {
  const [registrationModal, setRegistrationModal] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const fetchUserInfo = async (accessToken) => {
    try {
      const res = await fetch("http://localhost:8000/api/profile/", {
        headers: {
          Authorization: `Bearer ${accessToken}`, 
        },
      });
      if (!res.ok) throw new Error("Ошибка получения профиля");
      const data = await res.json();
      return {
        username: data.username,
        email: data.email,
        name: data.name || data.first_name,
        surname: data.surname || data.last_name,
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        setErrorMessage("Пожалуйста, введите логин и пароль");
        return;
      }

      const tokens = await getToken(username, password);
      localStorage.setItem("access_token", tokens.access);
      localStorage.setItem("refresh_token", tokens.refresh);
      setErrorMessage("");

      const userInfo = await fetchUserInfo(tokens.access);
      if (onLoginSuccess && userInfo) onLoginSuccess(userInfo);

      navigate("/account");
    } catch (err) {
      setErrorMessage(err.message || "Ошибка авторизации");
    }
  };
  
  
  const handleRegister = async () => {
    try {
      if (!username || !password || !name || !surname || !email) {
        setErrorMessage("Пожалуйста, заполните все поля");
        return;
      }

      const res = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, name, surname, email }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Регистрация не удалась");
      }
      
      await handleLogin();
    } catch (err) {
      setErrorMessage(err.message); 
    }
  };

  return (
    <div className="registration">
      <RegistrationModal
        registrationModal={registrationModal}
        setRegistrationModal={setRegistrationModal}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        name={name}
        setName={setName}
        surname={surname}
        setSurname={setSurname}
        email={email}
        setEmail={setEmail}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
