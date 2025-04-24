import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();

  async function logIn(e: React.FormEvent) {
    e.preventDefault();

    if (!email) {
      setLoginError("Enter email");
      return;
    }
    if (!password) {
      setLoginError("Enter password");
      return;
    }

    try {
      const body = {
        email,
        password,
      };
      await axios.post("https://movies-backend-4bx3.onrender.com/login", body, {
        withCredentials: true,
      });
      navigate("..");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setLoginError(error.response?.data?.error || "Unknown error");
      }
    }
  }

  return (
    <form onSubmit={logIn}>
      <h2>Log In</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />{" "}
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />{" "}
      {loginError && <h3>{loginError}</h3>}
      <br />
      <button type="submit">Login</button>
      <button onClick={() => navigate("..")}>Back</button>
    </form>
  );
}
