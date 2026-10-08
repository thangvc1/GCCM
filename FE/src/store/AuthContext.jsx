import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { authApi, tokenStorage } from "../api";

const AuthContext = createContext(null);
const USER_KEY = "user_info";

const decodeTokenUser = (token) => {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return normalizeUser({
      username: payload.username || payload.sub,
      fullName: payload.username || payload.sub,
      role: payload.role,
    });
  } catch {
    return null;
  }
};

const normalizeUser = (data) => {
  const userData = data?.user || data;
  if (!userData) return null;
  return {
    ...userData,
    fullName: userData.fullName || userData.username,
    role: userData.role?.startsWith("ROLE_")
      ? userData.role
      : `ROLE_${String(userData.role || "CUSTOMER").toUpperCase()}`,
  };
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => tokenStorage.get());
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      return parsedUser || decodeTokenUser(tokenStorage.get());
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    const currentToken = tokenStorage.get();
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const meResponse = await authApi.getMe();
      const userData = normalizeUser(meResponse?.user || meResponse);

      if (userData?.username) {
        setUser(userData);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      } else {
        const savedUser = localStorage.getItem(USER_KEY);
        const fallbackUser =
          (savedUser && normalizeUser(JSON.parse(savedUser))) ||
          decodeTokenUser(currentToken);

        if (fallbackUser) {
          setUser(fallbackUser);
          localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser));
        }
      }
    } catch {
      const savedUser = localStorage.getItem(USER_KEY);
      const fallbackUser =
        (savedUser && normalizeUser(JSON.parse(savedUser))) ||
        decodeTokenUser(currentToken);

      if (fallbackUser) {
        setUser(fallbackUser);
        localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser));
      } else {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      const receivedToken = response?.token || response?.accessToken;

      if (receivedToken) {
        tokenStorage.set(receivedToken);
        setToken(receivedToken);
      }

      let receivedUser = normalizeUser(response);

      try {
        const meResponse = await authApi.getMe();
        const meUser = normalizeUser(meResponse?.user || meResponse || {});
        if (meUser?.username) {
          receivedUser = meUser;
        }
      } catch {
        // ignore /me failure and fall back to login payload
      }

      if (receivedUser?.username) {
        localStorage.setItem(USER_KEY, JSON.stringify(receivedUser));
        setUser(receivedUser);
      } else {
        await fetchCurrentUser();
      }

      return response;
    } catch (err) {
      throw new Error(
        err.message || "Tên đăng nhập hoặc mật khẩu không chính xác",
      );
    }
  };

  const register = async (userData) => {
    return authApi.register(userData);
  };

  const logout = () => {
    tokenStorage.remove();
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
}
