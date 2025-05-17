import { useState } from "react";
import "./registrationModal.css";
import {
  validateEmail,
  validateLogin,
  validatePassword,
  validateRepeatPassword,
  validateAuthorizationName,
  validateAuthorizationPassword,
  validateUserCredentials,
  validateNameField,
} from "../../utils/validators";

export const RegistrationModal = ({
  registrationModal,
  setRegistrationModal,
  handleLogin,
  handleRegister,
  username,
  setUsername,
  password,
  setPassword,
  name,
  setName,
  surname,
  setSurname,
  email,
  setEmail,
  errorMessage,
  setErrorMessage,
  users = [], // список пользователей для валидации логина
}) => {
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleLoginWithValidation = () => {
    const loginError = validateAuthorizationName(username);
    const passwordError = validateAuthorizationPassword(password);
    const credentialsError = validateUserCredentials(username, password, users);

    const newErrors = {
      login: loginError,
      password: passwordError,
      credentials: credentialsError,
    };

    // Если есть хотя бы одна ошибка — показать
    if (Object.values(newErrors).some((err) => err)) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setErrorMessage(""); // сброс старых ошибок
    handleLogin(username, password); // успешный вход
  };

  const handleRegisterWithValidation = () => {
    const newErrors = {
      surname: validateNameField(surname),
      name: validateNameField(name),
      email: validateEmail(email),
      login: validateLogin(username, users),
      password: validatePassword(password),
      repeatPassword: validateRepeatPassword(password, repeatPassword),
    };

    if (Object.values(newErrors).some((err) => err)) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    handleRegister(name, surname, email, username, password);
  };

  return (
    <>
      {registrationModal === "login" ? (
        <div className="registrationModal">
          <div className="titleRegistrationModal">Вход</div>
          <div className="blockRegistrationModal">
            <div className="containerRegistrationModal">
              <div className="titleInputRegistrationModal">Логин</div>
              <input
                type="text"
                placeholder="Введите логин..."
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.login && <div className="errorMessage">{errors.login}</div>}
            </div>
            <div className="containerRegistrationModal">
              <div className="titleInputRegistrationModal">Пароль</div>
              <input
                type="password"
                placeholder="Введите пароль..."
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div className="errorMessage">{errors.password}</div>}
            </div>
            
            {errorMessage && <div className="errorMessage">{errorMessage}</div>}
            <div className="btnBlockRegistrationModal">
              <div className="btnRegistrationModal" onClick={handleLoginWithValidation}>
                Войти
              </div>
              <div
                className="textBtnBlockRegistrationModal"
                onClick={() => {
                  setErrorMessage("");
                  setErrors({});
                  setRegistrationModal("registration");
                }}
              >
                Создать аккаунт
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="registrationModal">
          <div className="titleRegistrationModal">О себе</div>
          <div className="blockRegistrationModal">
            <div className="lineRegistrationModal">
              <div className="containerRegistrationModal">
                <div className="titleInputRegistrationModal">Фамилия</div>
                <input
                  type="text"
                  placeholder="Введите фамилию..."
                  className="input"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
                {errors.surname && <div className="errorMessage">{errors.surname}</div>}
              </div>
              <div className="containerRegistrationModal">
                <div className="titleInputRegistrationModal">Имя</div>
                <input
                  type="text"
                  placeholder="Введите имя..."
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <div className="errorMessage">{errors.name}</div>}
              </div>
            </div>
            <div className="containerRegistrationModal">
              <div className="titleInputRegistrationModal">Email</div>
              <input
                type="text"
                placeholder="Введите email..."
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <div className="errorMessage">{errors.email}</div>}
            </div>
            <div className="containerRegistrationModal">
              <div className="titleInputRegistrationModal">Логин</div>
              <input
                type="text"
                placeholder="Введите логин..."
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.login && <div className="errorMessage">{errors.login}</div>}
            </div>
            <div className="containerRegistrationModal">
              <div className="titleInputRegistrationModal">Пароль</div>
              <input
                type="password"
                placeholder="Введите пароль..."
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div className="errorMessage">{errors.password}</div>}
            </div>
            <div className="containerRegistrationModal">
              <div className="titleInputRegistrationModal">Повторите пароль</div>
              <input
                type="password"
                placeholder="Повторите пароль..."
                className="input"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
              {errors.repeatPassword && <div className="errorMessage">{errors.repeatPassword}</div>}
            </div>
            {errorMessage && <div className="errorMessage">{errorMessage}</div>}
            <div className="btnBlockRegistrationModal">
              <div className="btnRegistrationModal" onClick={handleRegisterWithValidation}>
                Создать аккаунт
              </div>
              <div
                className="textBtnBlockRegistrationModal"
                onClick={() => {
                  setErrorMessage("");
                  setErrors({});
                  setRegistrationModal("login");
                }}
              >
                Уже есть аккаунт?
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
