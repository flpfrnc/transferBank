// component responsible for returning auth based or public routes
import { useAuth } from "../context/AuthContext";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../screens/Home";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Layout from "./Layout";

function RoutesComponent() {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return (
      <Routes>
        <Route
          index
          element={
            <Layout>
              <Home data-testid="home" />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route data-testid="login" path="/login" element={<Login />} />
      <Route data-testid="register" path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <RoutesComponent />
    </BrowserRouter>
  );
}
