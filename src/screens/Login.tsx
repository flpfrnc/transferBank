import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import UserForm from "../components/UserForm";

export default function Login() {
  const { authenticate } = useAuth();
  const [authCredentials, setAuthCredentials] = useState({
    username: "",
    password: "",
  });

  function handleLogin() {
    authenticate(authCredentials.username, authCredentials.password);
  }

  return (
    <div className="flex w-full h-[100vh] justify-center items-center bg-[#f1f1f1]">
      <div className="w-fit h-[20rem] shadow-lg rounded-lg flex justify-center items-center bg-white">
        <div>
          <UserForm title="Login" credentials={authCredentials} setCredentials={setAuthCredentials} />
          <footer className="px-8 w-full flex flex-col items-center justify-center gap-4">
            <button
              data-testid="login-button"
              onClick={handleLogin}
              className="h-[40px] w-[250px] bg-blue-600 hover:bg-blue-500 active:bg-blue-800 rounded-lg text-white font-bold"
            >
              Login
            </button>
            <Link to="/register">
              <span className="italic">Cadastre-se</span>
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
