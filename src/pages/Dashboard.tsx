import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  async function onButtonClick() {
    try {
      const { data } = await axios.get(
        "https://movies-backend-4bx3.onrender.com/userData",
        {
          withCredentials: true,
        }
      );
      console.log(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          console.log(error.response);
          navigate("/login");
        } else {
          console.log(error);
        }
      }
    }
  }

  return (
    <div>
      <button onClick={onButtonClick}>Click Me</button>
    </div>
  );
}
