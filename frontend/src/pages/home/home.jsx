import { useCallback, useEffect, useRef, useState } from "react";
import { Header } from "../../components/header/header";
import "./home.css";
import phone from "../../assets/img/phone.png";
import posterPlaceholder from "../../assets/img/poster.png";
import like from "../../assets/img/like.png";
import dislike from "../../assets/img/dislike.png";
import { ProfileModal } from "../../components/profileModal/profileModal";

export const Home = ({
  openProfileModal,
  setOpenProfileModal,
  userInfo,
  setIsLoggedIn,
  setUserInfo,
}) => {
  const [currentMovie, setCurrentMovie] = useState(null);
  const [currentPoster, setCurrentPoster] = useState("");
  const [nextMovie, setNextMovie] = useState(null);
  const [nextPoster, setNextPoster] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const token = localStorage.getItem("access_token");
  const isLoggedIn = !!token;

  const hasFetchedOnce = useRef(false);
  const isLoadingNext = useRef(false);
  const shownMovieIds = useRef(new Set());
  const MAX_SHOWN_MOVIES = 300;

  const fetchMovieWithPoster = useCallback(async (maxRetries = 10) => {
    if (!token) return null;
    const exclude = Array.from(shownMovieIds.current);
    const query = exclude.map((id) => `exclude=${id}`).join("&");
    const url = `http://127.0.0.1:8000/api/random-movie/?${query}`;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
        }

        const movie = await response.json();
        const posterUrl = movie?.poster?.previewUrl || movie?.poster?.url;

        if (!movie?.id || !posterUrl) {
          continue;
        }

        if (shownMovieIds.current.has(movie.id)) {
          continue;
        }

        shownMovieIds.current.add(movie.id);
        while (shownMovieIds.current.size > MAX_SHOWN_MOVIES) {
          const firstId = shownMovieIds.current.values().next().value;
          shownMovieIds.current.delete(firstId);
        }

        return { ...movie, posterUrl };
      } catch (err) {
        console.error("Ошибка при загрузке фильма:", err);
        return null;
      }
    }

    return null;
  }, [token]);

  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        console.log("Изображение загружено успешно:", src);
        resolve();
      };
      img.onerror = (e) => {
        console.error("Ошибка загрузки постера:", src, e);
        reject(e);
      };
    });
  };
  

  const preloadNextMovie = useCallback(async () => {
    if (isLoadingNext.current) return;
    isLoadingNext.current = true;

    const movie = await fetchMovieWithPoster();
    if (movie) {
      try {
        await preloadImage(movie.posterUrl);
        setNextMovie(movie);
        setNextPoster(movie.posterUrl);
      } catch (err) {
        console.warn("Ошибка загрузки постера:", err);
      }
    }

    isLoadingNext.current = false;
  }, [fetchMovieWithPoster]);

  const loadNextMovie = useCallback(async () => {
    setShowDetails(false);

    if (nextMovie) {
      setCurrentMovie(nextMovie);
      setCurrentPoster(nextPoster);
      setNextMovie(null);
      setNextPoster("");
      await preloadNextMovie();
    } else {
      const movie = await fetchMovieWithPoster();
      if (movie) {
        setCurrentMovie(movie);
        setCurrentPoster(movie.posterUrl);
        await preloadNextMovie();
      } else {
        setCurrentMovie(null);
        setCurrentPoster("");
      }
    }
  }, [nextMovie, nextPoster, fetchMovieWithPoster, preloadNextMovie]);

  useEffect(() => {
    if (!hasFetchedOnce.current && isLoggedIn) {
      hasFetchedOnce.current = true;
      loadNextMovie();
    }
  }, [isLoggedIn, loadNextMovie]);

  const handleLike = async () => {
    if (!currentMovie?.id) return;

    try {
      await fetch("http://127.0.0.1:8000/api/selected/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movie_id: currentMovie.id }),
      });
    } catch (err) {
      console.error("Ошибка при добавлении в избранное:", err);
    }

    await loadNextMovie();
  };

  const handleDislike = async () => {
    await loadNextMovie();
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserInfo(null);
    setOpenProfileModal(false);
  };

  const toggleDetails = () => {
    const poster = document.querySelector(".posterPhoneHomePage");
    const card = document.querySelector(".movieInfoCard");
  
    if (!showDetails) {
      if (poster) {
        poster.classList.remove("fadeOut");
        poster.classList.add("fadeOut");
      }
  
      setTimeout(() => setShowDetails(true), 200);
    } else {
      if (card) {
        card.classList.remove("hide");
        card.classList.add("hide");
      }
  
      setTimeout(() => setShowDetails(false), 200);
    }
  };
  

  return (
    <div className="homePage">
      <Header setOpenProfileModal={setOpenProfileModal} />

      {!isLoggedIn && (
        <div className="loginMessage">Пожалуйста, войдите в систему</div>
      )}

      <div className="titleContainerHomePage">
        <div className="titleHomePage">Что посмотреть?</div>
        {/* <div className="btnContainerHomePage">
          <div className="buttonLeftHomePage">Комедия</div>
          <div className="buttonRightHomePage">Фильтр</div>
        </div> */}
      </div>

      <div className="imgContainerPhoneHomePage">
        <img src={phone} className="imgPhoneHomePage" alt="phone" />
      </div>

      <div className="posterContainerPhoneHomePage" onClick={toggleDetails}>
        {!showDetails && currentPoster ? (
          <img
            key={currentPoster}
            src={currentPoster}
            className="posterPhoneHomePage"
            alt="Movie poster"
            loading="lazy"
          />
        ) : showDetails && currentMovie ? (
          <div className="movieInfoCard">
            <div className="movieTitle">{currentMovie.name || currentMovie.title || "Без названия"}</div>
            <div className="movieRating">Рейтинг: {currentMovie.rating?.kp || "Нет данных"}</div>
            <div className="movieDescription">{currentMovie.description || "Описание отсутствует."}</div>
          </div>
        ) : (
          <img
            src={posterPlaceholder}
            className="posterPhoneHomePage"
            alt="Poster placeholder"
          />
        )}
      </div>

      <div className="likeBlockHomePage">
        <div className="likeContainerHomePage">
          <img
            src={dislike}
            className="likePhoneHomePage"
            alt="Dislike"
            onClick={handleDislike}
            style={{ cursor: "pointer" }}
          />
          <img
            src={like}
            className="likePhoneHomePage"
            alt="Like"
            onClick={handleLike}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      {openProfileModal && (
        <div className="profileModalHomePage">
          <ProfileModal
            setOpenProfileModal={setOpenProfileModal}
            name={userInfo?.name}
            surname={userInfo?.surname}
            email={userInfo?.email}
            username={userInfo?.username}
            onLogout={handleLogout}
          />
        </div>
      )}
    </div>
  );
};
