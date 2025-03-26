import React, {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import axios from "axios";
import api from "@/api";
import { useNavigate } from "react-router-dom";
import { set } from "zod";

export interface Credential {
  username: string;
  password: string;
}

interface User {
  role: string;
  username: string;
  phoneNumber: string;
  store: string;
}

interface AuthResponse {
  authenticated: boolean;
  user: User;
  store: string;
}

interface AuthContextType {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: Credential) => Promise<boolean>;
  logout: () => Promise<boolean>;
  loginWithOTP: (phoneNumber: string, otp: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token") || "";
      setToken(storedToken);
      setIsLoggedIn(!!storedToken);
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);
  const [user, setUser] = useState<User | null>(null);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8081",
    withCredentials: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }
      try {
        const response = await axiosInstance.get<AuthResponse>(
          "/api/auth/status",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsAuthenticated(response.data.authenticated);
        const userInfo = {
          role: response.data.user.role,
          username: response.data.user.username,
          phoneNumber: response.data.user.phoneNumber,
          store: response.data.store,
        };
        console.log(userInfo); // Add this line to print the userInfo object to the console`
        setUser(userInfo);
        console.log(response.data);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: Credential) => {
    try {
      const formData = new FormData();
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);
      const username = credentials.username;
      const password = credentials.password;

      console.log(username);
      console.log(password);

      try {
        const response = await api.post(
          "/auth/login",
          new URLSearchParams({ username, password }),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
        const newToken: string = response.data.token;

        console.log(response.data);
        setToken(newToken);
        localStorage.setItem("token", newToken);

        if (newToken) {
          setIsLoggedIn(true);
          const response = await axiosInstance.get<AuthResponse>(
            "/api/auth/status",
            {
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
            }
          );
          setIsAuthenticated(response.data.authenticated);
          const userInfo = {
            role: response.data.user.role,
            username: response.data.user.username,
            phoneNumber: response.data.user.phoneNumber,
            store: response.data.store,
          };
          setUser(userInfo);
          localStorage.setItem("user", userInfo.username);
          localStorage.setItem("store", response.data.store);
          console.log(response.data);
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error(error);
      }

      return false;
    } catch (error) {}
  };

  const loginWithOTP = async (phoneNumber: string, otp: string) => {
    try {
      // Import the AuthAPI service
      const { verifyLoginOTP } = await import("../services/AuthAPI");

      // Call the service function
      const response = await verifyLoginOTP(phoneNumber, otp);

      if (response.success) {
        // Refresh auth state after OTP login
        const authResponse = await axiosInstance.get<AuthResponse>(
          "/api/auth/status"
        );
        setIsAuthenticated(authResponse.data.authenticated);
        setUser(authResponse.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("OTP login error:", error);
      return false;
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("store");
    setToken("");
    setUser(null);
    setIsLoggedIn(false);
    await alert("Logged out successfully");
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isLoggedIn,
        setIsLoggedIn,
        isAuthenticated,
        user,
        login: async (credentials: Credential) => {
          const result = await login(credentials);
          return result ?? false;
        },
        logout,
        loginWithOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
