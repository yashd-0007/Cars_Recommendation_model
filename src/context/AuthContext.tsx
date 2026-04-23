import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface UserPayload {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  role: string;
  city?: string;
}

interface AuthContextType {
  user: UserPayload | null;
  login: (userData: UserPayload) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from sessionStorage on load (clears after closing tab)
  useEffect(() => {
    const storedUser = sessionStorage.getItem("dreamDriveUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: UserPayload) => {
    setUser(userData);
    sessionStorage.setItem("dreamDriveUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("dreamDriveUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
