import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "./AuthContextProvider";
import { MovieType } from "./IndexPage";

export type CommentType = {
  id: number;
  useremail: string;
  movieid: number;
  rating: number;
  time: string;
  comment: string;
  likes: string[];
};

export default function MoviePage() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<MovieType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const { isAuthenticated, setIsAuthenticated } = useAuthContext();
  const [userEmail, setUserEmail] = useState("");
  const [hasComment, setHasComment] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get(
          "https://movies-backend-4bx3.onrender.com/validateToken",
          {
            withCredentials: true,
          }
        );

        setIsAuthenticated(true);

        const { data } = await axios.get(
          "https://movies-backend-4bx3.onrender.com/userEmail",
          {
            withCredentials: true,
          }
        );

        setUserEmail(data);
      } catch {
        setIsAuthenticated(false);
      }
    };

    fetchData();
  }, [setIsAuthenticated]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://movies-backend-4bx3.onrender.com/movie/${movieId}`)
      .then((response) => setMovie(response.data));

    axios
      .get(`https://movies-backend-4bx3.onrender.com/comments/${movieId}`)
      .then((response) => setComments(response.data));
  }, [movieId, refreshKey]);

  useEffect(() => {
    if (comments && userEmail) {
      const hasUserCommented = comments.some(
        (comment) => comment.useremail === userEmail
      );
      setHasComment(hasUserCommented);
    }
  }, [comments, userEmail]);

  function deleteComment(commentId: number) {
    axios
      .delete(
        `https://movies-backend-4bx3.onrender.com/comments/${movieId}/${commentId}`
      )
      .then(() => setRefreshKey((prev) => prev + 1));
  }

  function onLogout() {
    axios
      .post(
        "https://movies-backend-4bx3.onrender.com/logout",
        {},
        { withCredentials: true }
      )
      .then(() => {
        setIsAuthenticated(false);
        setUserEmail("");
      });
  }

  function addLike(commentId: number) {
    const body = {
      userEmail: userEmail,
    };

    axios
      .put(
        `https://movies-backend-4bx3.onrender.com/comments/like/${commentId}`,
        body
      )
      .then(() => setRefreshKey((prev) => prev + 1));
  }

  return (
    <div>
      <h2>{movie?.name}</h2>
      <h3>
        {movie?.rating
          ? "Score: " +
            (
              movie.rating.reduce((acc, cur) => acc + cur, 0) /
              movie.rating.length
            ).toFixed(1) +
            "/5"
          : "Not Rated"}
      </h3>
      <img src={movie?.imgurl} alt="" />
      <p>{movie?.description}</p>
      <button onClick={() => navigate("..")}>Home</button>
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
      {comments.map((comment) =>
        comment.useremail === userEmail ? (
          <div key={comment.id}>
            <h4>User: {comment.useremail}</h4>
            <h4>Rated: {comment.rating}/5</h4>
            <p>
              {comment.comment ? "Comment: " + comment.comment : "No comment."}
            </p>
            <p>{new Date(comment.time).toLocaleString()}</p>
            <button
              onClick={() => navigate(`/comment/${movieId}/${comment.id}`)}
            >
              Edit
            </button>
            <button onClick={() => deleteComment(comment.id)}>Delete</button>
          </div>
        ) : (
          <div key={comment.id}>
            <h4>User: {comment.useremail}</h4>
            <h4>Rated: {comment.rating}/5</h4>
            <p>
              {comment.comment ? "Comment: " + comment.comment : "No comment."}
            </p>
            <p>{new Date(comment.time).toLocaleString()}</p>
            <i
              onClick={() => addLike(comment.id)}
              className={`fa-solid fa-heart ${
                comment.likes.includes(userEmail) && "red"
              }`}
            ></i>
            <span> {comment.likes.length}</span>
          </div>
        )
      )}
      {isAuthenticated ? (
        <button
          hidden={hasComment}
          onClick={() => navigate(`/movie/${movieId}/addComment`)}
        >
          Add a review
        </button>
      ) : (
        <p>To add a comment you need to login first.</p>
      )}
    </div>
  );
}
