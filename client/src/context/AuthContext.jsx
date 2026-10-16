import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/client";

const AuthContext = createContext(null);

// Some backend account responses include refreshToken. Keep only display data.
function publicUser(user) {
  if (!user) return null;
  const { _id, username, fullName, email, avatar, coverImage, createdAt } =
    user;
  return { _id, username, fullName, email, avatar, coverImage, createdAt };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    let active = true;
    authApi
      .current((waiting) => {
        if (active) setConnecting(waiting);
      })
      .then(({ data }) => {
        if (active) setUser(publicUser(data.data));
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function login(identifier, password, onWaiting) {
    const { data } = await authApi.login(identifier, password, onWaiting);
    setUser(publicUser(data.data.user));
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
  }

  function updateUser(value) {
    setUser(publicUser(value));
  }

  return (
    <AuthContext.Provider value={{ user, loading, connecting, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
