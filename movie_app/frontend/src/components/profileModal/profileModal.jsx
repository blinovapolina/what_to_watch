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
<div className="lineFavouriteProfileModal">Избранное <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12.43 0.929932L18.5 6.99993L12.43 13.0699M1.5 6.99993H18.33" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
</svg></div>
<div className="logoutTextProfileModal">
Выйти из аккаунта
</div>
        </div>
    )
}