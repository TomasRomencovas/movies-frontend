import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "./AuthContextProvider";

type ProtectedProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedProps) {
  const { isAuthenticated, setIsAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/validateToken", { withCredentials: true })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
        navigate("/login");
      });
  }, [navigate, setIsAuthenticated]);

  if (!isAuthenticated) {
    return;
  }

  return children;
}
