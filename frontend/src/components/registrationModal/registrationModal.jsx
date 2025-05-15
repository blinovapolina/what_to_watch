import { useState } from "react";
import { Link } from "react-router-dom";
import "./registrationModal.css";

export const RegistrationModal = ({
  registrationModal,
  setRegistrationModal,
  handleLogin,
  handleRegister,
  setUsername,
  setPassword,
  setName,
  setSurname,
  setEmail,
  errorMessage,
  setErrorMessage,
}) => {
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
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
            <div className="containerRegistrationModal">
              <div className="titleInputRegistrationModal">Пароль</div>
              <input
                type="password"
                placeholder="Введите пароль..."
                className="input"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errorMessage && <div className="errorMessage">{errorMessage}</div>}
            <div className="btnBlockRegistrationModal">
              <div className="btnRegistrationModal" onClick={handleLogin}>Войти</div>
              <div
                className="textBtnBlockRegistrationModal"
                onClick={() => {
                  setErrorMessage("");
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
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>
              <div className="containerRegistrationModal">
                <div className="titleInputRegistrationModal">Имя</div>
                <input
                  type="text"
                  placeholder="Введите имя..."
                  className="input"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="containerRegistrationModal">
              <div className="titleInputRegistrationModal">Email</div>
              <input
                type="text"
                placeholder="Введите email..."
                className="input"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="containerRegistrationModal">
              <div className="titleInputRegistrationModal">Логин</div>
              <input
                type="text"
                placeholder="Введите логин..."
                className="input"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="containerRegistrationModal">
              <div className="titleInputRegistrationModal">Пароль</div>
              <input
                type="password"
                placeholder="Введите пароль..."
                className="input"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errorMessage && <div className="errorMessage">{errorMessage}</div>}
            <div className="btnBlockRegistrationModal">
              <div className="btnRegistrationModal" onClick={handleRegister}>
                Создать аккаунт
              </div>
              <div
              className="textBtnBlockRegistrationModal"
              onClick={() => {
                setErrorMessage("");         
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