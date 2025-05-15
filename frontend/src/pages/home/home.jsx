import { useCallback, useEffect, useRef, useState } from "react";
import { Header } from "../../components/header/header";
import "./home.css";
import phone from "../../assets/img/phone.png";
import posterPlaceholder from "../../assets/img/poster.png";
import like from "../../assets/img/like.png";
import dislike from "../../assets/img/dislike.png";
import { ProfileModal } from "../../components/profileModal/profileModal";

export const Home = ({ openProfileModal, setOpenProfileModal, userInfo }) => {
  const [movie, setMovie] = useState(null);
  const [poster, setPoster] = useState("");
  const [hasUserInteracted] = useState(false);  
  const hasFetchedOnce = useRef(false); 
  const token = localStorage.getItem('access_token');
  const isLoggedIn = !!token;

  const fetchMovieWithPoster = useCallback(async () => {
    if (!token) return;
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/random-movie/", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
  
      const movie = await response.json();
  
      if (!movie?.id || !movie?.poster) {
        console.warn("Получен фильм без ID или постера");
        return;
      }
  
      setMovie(movie);
      setPoster(movie.poster.previewUrl);
    } catch (err) {
      console.error("Ошибка при загрузке фильма:", err);
    }
  }, [token]);
  

  useEffect(() => {
    if (!hasFetchedOnce.current && isLoggedIn) {
      hasFetchedOnce.current = true;
      fetchMovieWithPoster();
    }
  }, [isLoggedIn, fetchMovieWithPoster]);


  const handleLike = async () => {
    if (!movie?.id) return;

    const token = localStorage.getItem('access_token');
    
    if (!token) {
      console.error("Токен не найден в localStorage");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/selected/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ movie_id: movie.id }),
      });

      if (!response.ok) {
        console.error("Не удалось добавить фильм в избранное");
      } else {
        console.log("Фильм добавлен в избранное");
      }

      setPoster("");  
      await fetchMovieWithPoster();
    } catch (err) {
      console.error("Ошибка при добавлении в избранное:", err);
    }
  };
  

  const handleDislike = async () => {
    setPoster("");
    await fetchMovieWithPoster();
  };

  return (
    <div className="homePage">
      <Header setOpenProfileModal={setOpenProfileModal} />

      {!isLoggedIn && (
        <div className="loginMessage">Пожалуйста, войдите в систему</div>
      )}

      <div className="titleContainerHomePage">
        <div className="titleHomePage">Что посмотреть?</div>
        <div className="btnContainerHomePage">
          <div className="buttonLeftHomePage">Комедия</div>
          <div className="buttonRightHomePage">Фильтр</div>
        </div>
      </div>

      <div className="imgContainerPhoneHomePage">
        <img src={phone} className="imgPhoneHomePage" alt="phone" />
      </div>

      <div className="posterContainerPhoneHomePage">
        {poster ? (
          <img src={poster} className="posterPhoneHomePage" alt="Movie poster" loading="lazy" />
        ) : (
          <img src={posterPlaceholder} className="posterPhoneHomePage" alt="Poster placeholder" />
        )}
      </div>

      <div className="likeBlockHomePage">
        <div className="likeContainerHomePage">
          <img src={dislike} className="likePhoneHomePage" alt="Dislike" onClick={handleDislike} style={{ cursor: "pointer" }} />
          <img src={like} className="likePhoneHomePage" alt="Like" onClick={handleLike} style={{ cursor: "pointer" }} />
        </div>
      </div>

      {openProfileModal && (
        <div className="profileModalHomePage">
          <ProfileModal
            setOpenProfileModal={setOpenProfileModal}
            name={userInfo.name}
            surname={userInfo.surname}
            email={userInfo.email}
            username={userInfo.username}
          />
        </div>
      )}
    </div>
  );
};
