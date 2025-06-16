import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBankConnected, setIsBankConnected] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedBankConnection = localStorage.getItem("bankConnected");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedBankConnection) {
      setIsBankConnected(JSON.parse(storedBankConnection));
    }

    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsBankConnected(false);
    localStorage.removeItem("user");
    localStorage.removeItem("bankConnected");
  };

  const setBankConnected = (connected) => {
    setIsBankConnected(connected);
    localStorage.setItem("bankConnected", JSON.stringify(connected));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isBankConnected,
        setBankConnected,
      }}
    >
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
