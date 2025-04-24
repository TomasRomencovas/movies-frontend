import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./AuthContextProvider";

export type MovieType = {
  id: number;
  name: string;
  rating: number[];
  imgurl: string;
  description: string;
};

export default function IndexPage() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredMovies, setFilteredMovies] = useState<MovieType[]>([]);
  const [limit, setLimit] = useState<number | null>(2);
  const [offset, setOffset] = useState(0);
  const [noMoviesFound, setNoMoviesFound] = useState("");

  const navigate = useNavigate();

  const { isAuthenticated, setIsAuthenticated } = useAuthContext();

  useEffect(() => {
    axios
      .get("https://movies-backend-4bx3.onrender.com/validateToken", {
        withCredentials: true,
      })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, [setIsAuthenticated]);

  useEffect(() => {
    axios
      .get("https://movies-backend-4bx3.onrender.com/movies", {
        params: { limit: limit, offset: offset },
      })
      .then((response) => setMovies(response.data));
  }, [limit, offset]);

  useEffect(() => {
    if (searchInput) {
      setLimit(null);
      setOffset(0);
      if (!limit) {
        const newFilteredMovies = movies.filter((movie) =>
          movie.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        setFilteredMovies(newFilteredMovies);
        if (!newFilteredMovies[0]) {
          setNoMoviesFound("Movie not found.");
        } else {
          setNoMoviesFound("");
        }
      }
    } else {
      setNoMoviesFound("");
      setFilteredMovies([]);
      setLimit(2);
    }
  }, [searchInput, limit, movies]);

  function onLogout() {
    axios
      .post(
        "https://movies-backend-4bx3.onrender.com/logout",
        {},
        { withCredentials: true }
      )
      .then(() => setIsAuthenticated(false));
  }

  return (
    <div>
      <div className="search">
        <h1>Movies</h1>
        <input
          type="text"
          placeholder="Search by movie name"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <br />
        {isAuthenticated ? (
          <div>
            <button onClick={() => navigate(`/profile`)}>Profile</button>
            <button onClick={onLogout}>Log Out</button>
          </div>
        ) : (
          <div>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </div>
        )}

        <hr />
      </div>
      <div className="movies">
        {!noMoviesFound &&
          ((filteredMovies[0] && filteredMovies) || movies).map((movie) => (
            <div onClick={() => navigate(`/movie/${movie.id}`)} key={movie.id}>
              <img src={movie.imgurl} alt="" />
              <h3>{movie.name}</h3>
              <h4>
                {movie.rating
                  ? "Score: " +
                    (
                      movie.rating.reduce((acc, cur) => acc + cur, 0) /
                      movie.rating.length
                    ).toFixed(1) +
                    "/5"
                  : "Not Rated"}
              </h4>
            </div>
          ))}
        {noMoviesFound && <h3>{noMoviesFound}</h3>}
      </div>
      <button
        hidden={limit === null || offset === 0}
        onClick={() => setOffset((prev) => prev - 2)}
      >
        Previous Page
      </button>
      <button
        hidden={limit === null}
        onClick={() => setOffset((prev) => prev + 2)}
      >
        Next Page
      </button>
    </div>
  );
}
