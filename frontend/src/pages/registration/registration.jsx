import { useState } from "react";
import { RegistrationModal } from "../../components/registrationModal/registrationModal";
import { getToken } from "../../services/auth";
import { useNavigate } from "react-router-dom"; 
import "./registration.css";

export const Registration = ({ onLoginSuccess }) => {
  const [registrationModal, setRegistrationModal] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate(); 

  const handleLogin = async () => {
    try {
      const token = await getToken(username, password);
      localStorage.setItem("token", token);
      setErrorMessage("");

      if (onLoginSuccess) {
        onLoginSuccess({
          name: "Иван",
          surname: "Иванов",
          email: "ivanovivan@gmail.com",
          nick: "vanya",
        });
      }

      navigate("/account");
    } catch (err) {
      setErrorMessage("Ошибка авторизации. Проверьте данные.");
    }
  };

  return (
    <div className="registration">
      <RegistrationModal
        registrationModal={registrationModal}
        setRegistrationModal={setRegistrationModal}
        handleLogin={handleLogin}
        setUsername={setUsername}
        setPassword={setPassword}
        errorMessage={errorMessage}
      />
    </div>
  );
};
