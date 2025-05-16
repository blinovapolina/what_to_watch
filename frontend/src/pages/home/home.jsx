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

        if (!movie?.id || !movie?.poster?.previewUrl) {
          console.warn("Получен фильм без ID или постера");
          continue;
        }

        if (shownMovieIds.current.has(movie.id)) {
          console.log("Фильм уже был показан, пробуем другой...");
          continue;
        }

        // Добавляем ID в просмотренные
        shownMovieIds.current.add(movie.id);

        // Ограничиваем размер shownMovieIds до MAX_SHOWN_MOVIES
        while (shownMovieIds.current.size > MAX_SHOWN_MOVIES) {
          const firstId = shownMovieIds.current.values().next().value;
          shownMovieIds.current.delete(firstId);
        }

        return movie;
      } catch (err) {
        console.error("Ошибка при загрузке фильма:", err);
        return null;
      }
    }

    console.warn("Не удалось найти уникальный фильм после нескольких попыток");
    return null;
  }, [token]);

  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = reject;
    });
  };

  const preloadNextMovie = useCallback(async () => {
    if (isLoadingNext.current) {
      console.log("Предзагрузка уже в процессе, пропускаем");
      return;
    }
    isLoadingNext.current = true;
    console.log("Начинаем предзагрузку следующего фильма...");

    const movie = await fetchMovieWithPoster();
    if (movie) {
      try {
        await preloadImage(movie.poster.previewUrl);
        setNextMovie(movie);
        setNextPoster(movie.poster.previewUrl);
        console.log("Следующий фильм предзагружен:", movie.name || movie.title || movie.id);
      } catch (imgError) {
        console.warn("Не удалось предзагрузить изображение постера:", imgError);
      }
    } else {
      console.log("Не удалось предзагрузить следующий фильм");
    }

    isLoadingNext.current = false;
  }, [fetchMovieWithPoster]);

  const loadNextMovie = useCallback(async () => {
    if (nextMovie) {
      console.log("Загружаем предзагруженный фильм:", nextMovie.name || nextMovie.title || nextMovie.id);
      setCurrentMovie(nextMovie);
      setCurrentPoster(nextPoster);
      setNextMovie(null);
      setNextPoster("");
      await preloadNextMovie();
    } else {
      console.log("Нет предзагруженного фильма, загружаем с API...");
      const movie = await fetchMovieWithPoster();
      if (movie) {
        console.log("Фильм с API загружен:", movie.name || movie.title || movie.id);
        setCurrentMovie(movie);
        setCurrentPoster(movie.poster.previewUrl);
        await preloadNextMovie();
      } else {
        console.log("Не удалось загрузить фильм с API");
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
      const response = await fetch("http://127.0.0.1:8000/api/selected/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movie_id: currentMovie.id }),
      });

      if (!response.ok) {
        console.error("Не удалось добавить фильм в избранное");
      } else {
        console.log("Фильм добавлен в избранное");
      }
      await loadNextMovie();
    } catch (err) {
      console.error("Ошибка при добавлении в избранное:", err);
    }
  };

  const handleDislike = async () => {
    await loadNextMovie();
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("surname");

    setIsLoggedIn(false);
    setUserInfo(null);
    setOpenProfileModal(false);
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
        {currentPoster ? (
          <img
            key={currentPoster}
            src={currentPoster}
            className="posterPhoneHomePage"
            alt="Movie poster"
            loading="lazy"
          />
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
