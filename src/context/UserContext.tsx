import React, { createContext, useContext, useState, useEffect } from "react";

// Define User type
interface User {
  id: string;
  name: string;
  email: string;
}

// Define UserContext type
export type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userRole: string | null;
  setUserRole: (role: string | null) => void;
  logout: () => void;
};

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the provider component
interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("userRole");

    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Convert JSON string back to object
    }
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  // Save user and role to localStorage when state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }

    if (userRole) {
      localStorage.setItem("userRole", userRole);
    } else {
      localStorage.removeItem("userRole");
    }
  }, [user, userRole]);

  const logout = () => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token"); // Clear token if stored
  };

  return (
    <UserContext.Provider value={{ user, setUser, userRole, setUserRole, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
