import { MD5 } from "crypto-js";
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
interface ContextProps {
  user: User | null;
  setUser: Dispatch<User>;
  isAuthenticated: boolean;
  authenticate: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

export interface User {
  username: string;
  userToken: string;
  pixKeys: string[];
  account: Account;
}

export interface Account {
  account: string;
  balance: number;
  transactions: Transaction[];
}

export interface Transaction {
  method: string;
  amount: number;
  type: string;
  date: string;
  sender: string;
  receiver: string;
}

interface AuthProviderProps {
  children?: ReactNode;
}

export const AuthContext = createContext<ContextProps>({} as ContextProps);

export function AuthProvider(props: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  /**
   * register an user creating a session token to be used based on credentials
   * @param username string
   * @param password string
   */
  async function register(username: string, password: string) {
    const token = MD5(username + password).toString();

    const storage = localStorage.getItem("users");

    if (!storage) {
      localStorage.setItem(
        "users",
        JSON.stringify([
          {
            username,
            userToken: token,
            account: { account: "001", balance: 0, transactions: [] },
            pixKeys: [],
          },
        ])
      );
      alert("Usuário cadastrado com sucesso");
      return (window.location.href = window.location.href.replace(
        "/login",
        "/"
      ));
    }

    const existingUsers: User[] = JSON.parse(storage);

    if (existingUsers.filter((u) => u.username === username).length > 0)
      return alert("Usuário já cadastrado");

    const lastRegisteredAccount = existingUsers.slice(-1).pop()
      ?.account?.account;

    localStorage.setItem(
      "users",
      JSON.stringify([
        ...existingUsers,
        {
          username,
          userToken: token,
          account: {
            account: (Number(lastRegisteredAccount) + 1)
              .toString()
              .padStart(3, "0"),
            balance: 0,
            transactions: [],
          },
          pixKeys: [],
        },
      ])
    );
    alert("Usuário cadastrado com sucesso");
    return (window.location.href = window.location.href.replace(
      "/register",
      "/login"
    ));
  }

  /**
   * receives a user object to be updated reflecting in the current storage
   * @param username string
   * @param password string
   */
  function updateUser(user: User) {
    const storage = localStorage.getItem("users");

    if (!storage) {
      return;
    }

    const existingUsers: User[] = JSON.parse(storage);

    existingUsers.some((object, idx) => {
      if (object.username === user.username) {
        existingUsers[idx] = user;
      }
    });

    localStorage.setItem("users", JSON.stringify(existingUsers));
  }

  /**
   * authenticates user based on stored user values
   * @param username string
   * @param password string
   */
  async function authenticate(username: string, password: string) {
    try {
      const token = MD5(username + password).toString();

      const storage = localStorage.getItem("users");

      if (!storage) {
        return alert("Usuário não cadastrado");
      }

      const existingUsers: User[] = JSON.parse(storage);
      const currentUser = existingUsers
        .filter((u) => u.userToken === token)
        .pop();

      setUserData(token, currentUser);
      window.location.href = window.location.href.replace("/login", "/");
    } catch (error: any) {
      alert(error.response?.data.detail);
      return;
    }
  }

  /**
   * apply token to local session and sets current user data
   * @param token string
   * @param user User | undefined
   */
  function setUserData(token: string, user: User | undefined) {
    if (!user) return;
    localStorage.setItem("token", token);

    setUser(user);
  }

  async function logout() {
    try {
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Ocorreu um erro no login");
      alert("Ocorreu um erro no login");
    }
    setUser(null);
    localStorage.removeItem("token");
  }

  // sets the authenticated user based on user session object stored
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      const storage = localStorage.getItem("users");

      if (!storage) {
        return;
      }

      const existingUsers: User[] = JSON.parse(storage);
      const loggedUser = existingUsers
        .filter((u) => u.userToken === token)
        .pop();

      if (!loggedUser) return;

      setUser(loggedUser);
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        authenticate,
        register,
        logout,
        updateUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
