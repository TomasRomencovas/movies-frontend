import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import IndexPage from "./pages/IndexPage.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import DashboardPage from "./pages/Dashboard.tsx";
import AuthContextProvider from "./pages/AuthContextProvider.tsx";
import MoviePage from "./pages/MoviePage.tsx";
import AddCommentPage from "./pages/AddCommentPage.tsx";
import EditCommentPage from "./pages/EditCommentPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route index element={<IndexPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/movie/:movieId" element={<MoviePage />} />
          <Route
            path="/movie/:movieId/addComment"
            element={<AddCommentPage />}
          />
          <Route
            path="/comment/:movieId/:commentId"
            element={<EditCommentPage />}
          />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
