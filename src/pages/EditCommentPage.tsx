import axios from "axios";
import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

export default function EditCommentPage() {
  const { movieId, commentId } = useParams();
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [finalStarRating, setFinalStarRating] = useState(0);
  const [starRating, setStarRating] = useState(0);

  const navigate = useNavigate();

  async function addNewComment(e: React.FormEvent) {
    e.preventDefault();
    console.log(commentId);
    try {
      const { data: userEmail } = await axios.get(
        "https://movies-backend-4bx3.onrender.com/userEmail",
        {
          withCredentials: true,
        }
      );

      if (finalStarRating === 0) {
        setCommentError("Click on the stars to rate the move from 1 to 5");
        return;
      }

      if (userEmail) {
        const newComment = {
          rating: Number(finalStarRating),
          comment,
        };

        await axios.put(
          `https://movies-backend-4bx3.onrender.com/comments/${movieId}/${commentId}`,
          newComment
        );
        navigate(`/movie/${movieId}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setCommentError(error.response?.data?.error || "Unknown error");
      }
    }
  }

  return (
    <form onSubmit={(e) => addNewComment(e)}>
      <h2>Edit your Review</h2>
      <i
        onMouseLeave={() => {
          setStarRating(0);
        }}
        onMouseEnter={() => {
          setStarRating(1);
        }}
        onClick={() => setFinalStarRating(1)}
        className={`fa-solid fa-star ${
          (starRating >= 1 && "gold") || (finalStarRating >= 1 && "gold")
        }`}
      ></i>
      <i
        onMouseLeave={() => {
          setStarRating(0);
        }}
        onMouseEnter={() => {
          setStarRating(2);
        }}
        onClick={() => setFinalStarRating(2)}
        className={`fa-solid fa-star ${
          (starRating >= 2 && "gold") || (finalStarRating >= 2 && "gold")
        }`}
      ></i>
      <i
        onMouseLeave={() => {
          setStarRating(0);
        }}
        onMouseEnter={() => {
          setStarRating(3);
        }}
        onClick={() => setFinalStarRating(3)}
        className={`fa-solid fa-star ${
          (starRating >= 3 && "gold") || (finalStarRating >= 3 && "gold")
        }`}
      ></i>
      <i
        onMouseLeave={() => {
          setStarRating(0);
        }}
        onMouseEnter={() => {
          setStarRating(4);
        }}
        onClick={() => setFinalStarRating(4)}
        className={`fa-solid fa-star ${
          (starRating >= 4 && "gold") || (finalStarRating >= 4 && "gold")
        }`}
      ></i>
      <i
        onMouseLeave={() => {
          setStarRating(0);
        }}
        onMouseEnter={() => {
          setStarRating(5);
        }}
        onClick={() => setFinalStarRating(5)}
        className={`fa-solid fa-star ${
          (starRating >= 5 && "gold") || (finalStarRating >= 5 && "gold")
        }`}
      ></i>
      <br />
      <input
        type="text"
        placeholder="Add a comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <br />
      <button type="submit">Submit</button>
      <button onClick={() => navigate(`/movie/${movieId}`)}>Back</button>
      <br />
      {commentError && <h3>{commentError}</h3>}
    </form>
  );
}
