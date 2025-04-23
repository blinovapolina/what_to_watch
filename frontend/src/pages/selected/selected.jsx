import { Link } from "react-router-dom";
import { Header } from "../../components/header/header";
import { ProfileModal } from "../../components/profileModal/profileModal";
import "./selected.css";

export const Selected = ({ openProfileModal, setOpenProfileModal ,userInfo}) => {
  const film_name = [
    "Дьявол носит Prada",
    "Интерстеллар",
    "Мстители",
    "1+1",
    "Стажер",
    "Джентельмены",
    "Ла-Ла Ленд",
    "Меню",
    "Человек Паук",
    "Железный человек",
    "Зеленая миля",
    "Дьявол носит Prada",
    "Интерстеллар",
    "Мстители",
    "1+1",
    "Стажер",
    "Джентельмены",
    "Ла-Ла Ленд",
    "Меню",
    "Человек Паук",
    "Железный человек",
    "Зеленая миля",
  ];
  return (
    <div className="selectedPage">
      <Header setOpenProfileModal={setOpenProfileModal} />
<div className="selected">
<Link to="/account" style={{textDecoration:"none"}}>
        <div className="textMainSelected"><svg width="24" height="19" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M19 9.49992H5M5 9.49992L12 15.0416M5 9.49992L12 3.95825" stroke="#9B9F9B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg> Главная</div></Link>  
      <div className="titleSelectedPage">Избранное </div>
      <div className="containerSelectedPage">
        <div className="containerScrollSelectedPage">
        {film_name.map((film) => (
          <div className="lineSelectedPage">
            <div className="leftLineSelectedPage">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.50317 8.24878L11.0016 13.7499L16.5026 8.2515"
                  stroke="#1E1E1E"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div className="nameFilmSelectedPage">{film}</div>
            </div>
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.8401 4.63673C20.3294 4.12573 19.7229 3.72037 19.0555 3.44381C18.388 3.16725 17.6726 3.0249 16.9501 3.0249C16.2276 3.0249 15.5122 3.16725 14.8448 3.44381C14.1773 3.72037 13.5709 4.12573 13.0601 4.63673L12.0001 5.69673L10.9401 4.63673C9.90843 3.60504 8.50915 3.02544 7.05012 3.02544C5.59109 3.02544 4.19181 3.60504 3.16012 4.63673C2.12843 5.66842 1.54883 7.06769 1.54883 8.52673C1.54883 9.98576 2.12843 11.385 3.16012 12.4167L12.0001 21.2567L20.8401 12.4167C21.3511 11.906 21.7565 11.2995 22.033 10.6321C22.3096 9.96462 22.4519 9.24922 22.4519 8.52673C22.4519 7.80424 22.3096 7.08883 22.033 6.42137C21.7565 5.75391 21.3511 5.14748 20.8401 4.63673Z"
                fill="#FF6D6D"
                stroke="#FF6D6D"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        ))}</div>
      </div>
    </div>  {openProfileModal?<div className="profileModalHomePage"><ProfileModal setOpenProfileModal={setOpenProfileModal} name={userInfo.name} surname={userInfo.surname} email={userInfo.email} nick={userInfo.nick} /></div>:null }</div>
  );
};
