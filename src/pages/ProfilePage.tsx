import { useEffect, useState } from "react";
import { useAuthContext } from "./AuthContextProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CommentType } from "./MoviePage";

export type UserType ={
  id: number;
  email: string;
  password: string;
  name: string;
}

export default function ProfilePage() {
    const [userEmail, setUserEmail] = useState("");
    const { setIsAuthenticated } = useAuthContext();
    const [comments, setComments] = useState<CommentType[]>([]);
    const [userData, setUserData] = useState<UserType | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)

 const navigate = useNavigate();
 
    useEffect(() => {
        const fetchData = async () => {
          try {
            await axios.get("http://localhost:3000/validateToken", {
              withCredentials: true,
            });
    
            setIsAuthenticated(true);
    
            const { data: email } = await axios.get("http://localhost:3000/userEmail", {
              withCredentials: true,
            });
    
            setUserEmail(email);

            const { data: allUserData } = await axios
          .post(`http://127.0.0.1:3000/userData/`, { email: email })

          setUserData(allUserData)

          } catch {
            setIsAuthenticated(false);
            navigate("..")
          }
        };
    
        fetchData();
      }, [setIsAuthenticated, navigate]);


      
      useEffect(() => {
          if(userEmail) {
              axios.post(`http://127.0.0.1:3000/userComments/`, {userEmail: userEmail}).then((response) => setComments(response.data))
            }
            
        }, [userEmail, refreshKey])

      function deleteComment( movieId: number, commentId: number,) {
            axios.delete(`http://127.0.0.1:3000/comments/${movieId}/${commentId}`).then(() => setRefreshKey((prev) => prev + 1))
       }

      function onLogout() {
            axios
            .post("http://localhost:3000/logout", {}, { withCredentials: true })
            .then(() => {setIsAuthenticated(false)
              navigate("..")
            });
      }


  return (
    <div>
        <h2>Your Profile</h2>
        <h3>{userData?.name}</h3>
        <h3>{userEmail}</h3>
        <button onClick={() => navigate("..")}>Home</button>
        <br />
        <button onClick={onLogout}>Log Out</button>
        <hr />
        {comments.map((comment) => (
            <div key={comment.id}>

            <h4>User: {comment.useremail}</h4>
            <h4>Rated: {comment.rating}/5</h4>
            <p>
              {comment.comment ? "Comment: " + comment.comment : "No comment."}
            </p>
            <p>{new Date(comment.time).toLocaleString()}</p>
            <button onClick={() => navigate(`/comment/${comment.movieid}/${comment.id}`)}>Edit</button>
          <button onClick={() => deleteComment(comment.movieid, comment.id)}>Delete</button>
              
          </div>
        ))}
    </div>
  )
}
