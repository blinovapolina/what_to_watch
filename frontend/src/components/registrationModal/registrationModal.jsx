import { useEffect } from "react"
import "./registrationModal.css"
import { Link } from "react-router-dom"
export const RegistrationModal = ({registartionModal,setRegistrationModal}) => {
    useEffect(()=>{},[registartionModal])
    return (
        <>
        {registartionModal==="login"?
        <div className="registrationModal">
            <div className="titleRegistrationModal">Вход</div>
            <div className="blockRegistrationModal">
            <div className="containerRegistrationModal">
                <div className="titleInputRegistrationModal">Логин</div>
                <input type="text" placeholder="Введите логин..." className="input"/>
            </div>
            <div className="containerRegistrationModal">
                <div className="titleInputRegistrationModal">Пароль</div>
                <input type="password" placeholder="Введите пароль..."  className="input"/>
            </div>
            <div className="btnBlockRegistrationModal">
            <Link to="/account" style={{textDecoration:"none",width:"100%"}}><div className="btnRegistrationModal">Войти</div></Link>
            <div className="textBtnBlockRegistrationModal" onClick={()=>setRegistrationModal("registration")}>Создать аккаунт</div>
            </div>
        </div>
        </div>
        :
        <div className="registrationModal">
        <div className="titleRegistrationModal">О себе</div>
        <div className="blockRegistrationModal">
            <div className="lineRegistrationModal">
        <div className="containerRegistrationModal">
            <div className="titleInputRegistrationModal">Фамилия</div>
            <input type="text" placeholder="Введите фамилию..." className="input"/>
        </div>
        <div className="containerRegistrationModal">
            <div className="titleInputRegistrationModal">Имя</div>
            <input type="text" placeholder="Введите имя..." className="input"/>
        </div></div>
        <div className="containerRegistrationModal">
            <div className="titleInputRegistrationModal">Email</div>
            <input type="text" placeholder="Введите email..." className="input"/>
        </div>
        <div className="containerRegistrationModal">
            <div className="titleInputRegistrationModal">Логин</div>
            <input type="text" placeholder="Введите логин..." className="input"/>
        </div>
        <div className="containerRegistrationModal">
            <div className="titleInputRegistrationModal">Пароль</div>
            <input type="password" placeholder="Введите пароль..." className="input"/>
        </div>
        <div className="btnBlockRegistrationModal">
        <Link to="/account" style={{textDecoration:"none",width:"100%"}}> <div className="btnRegistrationModal">Создать аккаунт</div></Link>
        <div className="textBtnBlockRegistrationModal" onClick={()=>setRegistrationModal("login")}>Уже есть аккаунт?</div>
        </div>
    </div></div>}
    </>
    )
}