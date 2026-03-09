import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(() => JSON.parse(localStorage.getItem("user")  || "null"));
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete axios.defaults.headers.common["Authorization"];
  }, [token]);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("user",  JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
    axios.defaults.headers.common["Authorization"] = `Bearer ${tokenData}`;
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  return (
    <AuthContext.Provider value={{ user, token, theme, login, logout, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
