import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [name, setName] = useState("");
  const [registrationError, setRegistrationError] = useState("");

  const navigate = useNavigate();

  async function submitRegistration(e: React.FormEvent) {
    e.preventDefault();
    const newUser = {
      email,
      password,
      name,
    };

    if (!email) {
      setRegistrationError("Enter your email");
      return;
    }

    if (!password) {
      setRegistrationError("Create password");
      return;
    }

    if (!repeatPassword) {
      setRegistrationError("Repeat password");
      return;
    }

    if (password !== repeatPassword) {
      setRegistrationError("Passwords do not match");
      return;
    }

    if (!name) {
      setRegistrationError("Enter your name");
      return;
    }

    try {
      await axios.post(
        "https://movies-backend-4bx3.onrender.com/users",
        newUser
      );
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setRegistrationError(
          error.response?.data?.error || "Unknown error occurred"
        );
      }
    }
  }

  return (
    <form onSubmit={(e) => submitRegistration(e)}>
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Repeat password"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      {registrationError && <h3>{registrationError}</h3>}
      <button type="submit">Register</button>
      <br />
      <button onClick={() => navigate("..")}>Back</button>
    </form>
  );
}
