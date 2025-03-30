import "./profileModal.css"
export const ProfileModal = ({name,surname,email,nick}) => {
    return (
        <div className="profileModal">
            <div className="titleProfileModal">Мой аккаунт</div>
            <div className="infoContainerProfileModaL">
                <div className="lineInfoProfileModal">Фамилия: {name}</div>
                <div className="lineInfoProfileModal">Имя: {surname}</div>
                <div className="lineInfoProfileModal">Email: {email}</div>
                <div className="lineInfoProfileModal">Логин: {nick}</div>
                </div>
<div className="lineFavouriteProfileModal">Избранное <svg width="26" height="14" viewBox="0 0 26 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1.91663 7H24.0833M24.0833 7L13 1.75M24.0833 7L13 12.25" stroke="#D9D9D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
</svg></div>
<div className="logoutTextProfileModal">
Выйти из аккаунта
</div>
        </div>
    )
}