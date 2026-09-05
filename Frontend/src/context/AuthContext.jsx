import { createContext, useContext, useState, useEffect, useCallback } from "react";
import profileService from "../services/profileService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await profileService.getProfile();
      setUser(data);
    } catch (err) {
      console.error("Failed to load user profile:", err);
      // If token expired or invalid, keep user null
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const loginUser = async (token) => {
    localStorage.setItem("access_token", token);
    await fetchUserProfile();
  };

  const logoutUser = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchUserProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        loginUser,
        logoutUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}